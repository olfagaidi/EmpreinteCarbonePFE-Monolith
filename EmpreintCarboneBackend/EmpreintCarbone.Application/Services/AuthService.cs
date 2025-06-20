
using EmpreintCarbone.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using EmpreintCarbone.Domain.Interfaces;
using EmpreintCarbone.Application.Interfaces;
using EmpreintCarbone.Application.DTOs;
using EmpreintCarbone.Application.Helpers;


namespace EmpreintCarbone.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly Dictionary<string, (string token, DateTime expires)> _resetTokens = new();
        private readonly IMailService _mailService;
        // Add the missing field declaration for _transportDataService
        private readonly ITransportDataService _transportDataService;
        private readonly IPackagingDataService _packagingDataService;
        private readonly IWasteDataService _wasteDataService;
        private readonly IEnergyDataService _energyDataService;
        private readonly IPrintingDataService _printingDataService;
        private readonly IWareHouseDataService _warehouseDataService;


        public AuthService(
            IUserRepository userRepository,
            IMailService mailService,
            ITransportDataService transportDataService,
            IPackagingDataService packagingDataService,
            IWasteDataService wasteDataService,
            IEnergyDataService energyDataService,
            IPrintingDataService printingDataService,
            IWareHouseDataService warehouseDataService)
        {
            _userRepository = userRepository;
            _mailService = mailService;
            _transportDataService = transportDataService;
            _packagingDataService = packagingDataService;
            _wasteDataService = wasteDataService;
            _energyDataService = energyDataService;
            _printingDataService = printingDataService;
            _warehouseDataService = warehouseDataService;
        }

        public async Task<User?> Login(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null || user.PasswordHash == null || user.PasswordSalt == null)
                return null;

            if (!VerifyPassword(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user; 
        }



        public async Task<User> Register(string username, string email)
        {
            var generatedPassword = GenerateRandomPassword(12);
            CreatePasswordHash(generatedPassword, out byte[] hash, out byte[] salt);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = username,
                Email = email,
                PasswordHash = hash,
                PasswordSalt = salt
            };

            await _userRepository.AddAsync(user);

            var subject = "Welcome to Our Platform - Your Login Details";
            var body = $@"
        <p>Hello <strong>{username}</strong>,</p>
        <p>Your account has been created successfully.</p>
        <p><strong>Email:</strong> {email}<br/>
        <strong>Temporary Password:</strong> {generatedPassword}</p>
        <p style='color:red;'>For security, please log in and change your password immediately.</p>
        <p>Login here: <a href='http://localhost:3000/login'>Login</a></p>";

            await _mailService.SendEmailAsync(email, subject, body);

            Console.WriteLine($"Generated password for {email}: {generatedPassword}");

            return user;
        }

        private static string GenerateRandomPassword(int length)
        {
            const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@$?_-";
            var randomBytes = new byte[length];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);

            var chars = new char[length];
            for (int i = 0; i < length; i++)
            {
                chars[i] = validChars[randomBytes[i] % validChars.Length];
            }

            return new string(chars);
        }

   
        public async Task<bool> UserExists(string email)
        {
            return await _userRepository.ExistsByEmailAsync(email);
        }

        private static void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using var hmac = new HMACSHA512();
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private static bool VerifyPassword(string password, byte[] hash, byte[] salt)
        {
            using var hmac = new HMACSHA512(salt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(hash);
        }

        public async Task<bool> SendPasswordResetEmail(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return false;

            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            var expiry = DateTime.UtcNow.AddHours(1);
            _resetTokens[email] = (token, expiry);

            var resetLink = $"http://localhost:3000/reset-password?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";
            var body = $"Click the link to reset your password: <a href='{resetLink}'>Reset Password</a><br>This link expires in 1 hour.";

            await _mailService.SendEmailAsync(email, "Reset your password", body);
            return true;
        }


        public async Task<bool> ResetPassword(string email, string newPassword, string token)
        {
            if (!_resetTokens.TryGetValue(email, out var tokenInfo) || tokenInfo.token != token || tokenInfo.expires < DateTime.UtcNow)
                return false;

            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return false;

            CreatePasswordHash(newPassword, out var hash, out var salt);
            user.PasswordHash = hash;
            user.PasswordSalt = salt;

            await _userRepository.UpdateAsync(user);
            _resetTokens.Remove(email);
            return true;
        }

       public async Task<bool> Archiver(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return false;
            user.Is_Archived = true;
            await _userRepository.UpdateAsync(user);
            return true;

        }

        public async Task<bool> Unarchiver(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return false;
            user.Is_Archived = false;
            await _userRepository.UpdateAsync(user);
            return true;
        }

     

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();

            return users.Select(user => new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                Is_Verified = user.Is_Verified

            });
        }

        public async Task<User> DeleteAccount(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
                return null;

            await _userRepository.DeleteAsync(user);
            return user;
        }


        public async Task<bool> ChangeInitialPassword(string email, string oldPassword, string newPassword)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
                return false;

            if (!VerifyPasswordHash(oldPassword, user.PasswordHash, user.PasswordSalt))
                return false;

            if (user.Is_Verified)
                return false; 

            CreatePasswordHash(newPassword, out byte[] newHash, out byte[] newSalt);
            user.PasswordHash = newHash;
            user.PasswordSalt = newSalt;
            user.Is_Verified = true;

            await _userRepository.UpdateAsync(user);
            return true;
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(storedHash);
        }

        public async Task<bool> ChangePassword(string email, string oldPassword, string newPassword)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
                return false;

            if (!VerifyPasswordHash(oldPassword, user.PasswordHash, user.PasswordSalt))
                return false;

            CreatePasswordHash(newPassword, out byte[] newHash, out byte[] newSalt);
            user.PasswordHash = newHash;
            user.PasswordSalt = newSalt;

            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<byte[]> GenerateUserEmissionReportAsync(Guid userId)
        {
            var transportData = await _transportDataService.GetAllByUserIdAsync(userId);
            var warehouseData = await _warehouseDataService.GetAllByUserIdAsync(userId);
            var packagingData = await _packagingDataService.GetAllByUserIdAsync(userId);
            var wasteData = await _wasteDataService.GetAllByUserIdAsync(userId);
            var energyData = await _energyDataService.GetAllByUserIdAsync(userId);
            var printingData = await _printingDataService.GetAllByUserIdAsync(userId);

            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

            var pdfBytes = new UserEmissionReportDocument(transportData, warehouseData, packagingData, wasteData, energyData, printingData).GeneratePdf();
            return pdfBytes;
        }

        public async Task<bool> UpdateUserInfo(Guid userId, UpdateUserDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Phone = dto.Phone;
            user.BirthDate = dto.BirthDate;
            user.JobTitle = dto.JobTitle;
            user.Department = dto.Department;
            user.Location = dto.Location;
            user.Manager = dto.Manager;

            if (dto.Photo != null)
            {
                using var ms = new MemoryStream();
                await dto.Photo.CopyToAsync(ms);
                user.Photo = ms.ToArray();
            }

            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<UserDataDto?> GetUserByIdAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return null;

            return new UserDataDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                BirthDate = user.BirthDate,
                JobTitle = user.JobTitle,
                Department = user.Department,
                Location = user.Location,
                Manager = user.Manager,
                Photo = user.Photo != null ? Convert.ToBase64String(user.Photo) : null
            };
        }



    }



}