using EmpreintCarbone.Application.DTOs;
using EmpreintCarbone.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.Interfaces
{
    public interface IAuthService
    {
        Task<User> Register(string username, string email);
        Task<User?> Login(string email, string password);
        Task<bool> UserExists(string email);
        Task<bool> SendPasswordResetEmail(string email);
        Task<bool> ResetPassword(string email, string newPassword, string token);
    
        Task<bool> Archiver(string email);
        Task<bool> Unarchiver(string email);
        Task<IEnumerable<UserDto>> GetAllAsync();

        Task<User> DeleteAccount(string email);

        Task<bool> ChangeInitialPassword(string email, string oldPassword, string newPassword);

        Task<bool> ChangePassword(string email, string oldPassword, string newPassword);

        Task<byte[]> GenerateUserEmissionReportAsync(Guid userId);

        Task<bool> UpdateUserInfo(Guid userId, UpdateUserDto dto);
        Task<UserDataDto?> GetUserByIdAsync(Guid userId);


    }
}
