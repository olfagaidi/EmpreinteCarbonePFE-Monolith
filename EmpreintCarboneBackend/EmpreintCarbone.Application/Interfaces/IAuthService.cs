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
        Task<bool> ResetPassword(string email, string token , string newPassword);
    
        Task<bool> Archiver(string email);
        Task<bool> Unarchiver(string email);
        Task<IEnumerable<UserDto>> GetAllAsync();

        Task<User> DeleteAccount(string email);

        Task<bool> ChangeInitialPassword(string email, string oldPassword, string newPassword);

        Task<bool> ChangePassword(string email, string oldPassword, string newPassword);

        Task<byte[]> GenerateUserEmissionReportAsync(Guid userId);

        Task<bool> UpdateUserInfo(Guid userId, UpdateUserDto dto);
        Task<UserDataDto?> GetUserByIdAsync(Guid userId);

        Task<double> GetTotalEmissionsAsync(Guid userId);

        Task<double> GetTransportEmissionsAsync(Guid userId);
        Task<double> GetWarehouseEmissionsAsync(Guid userId);

    Task<double> GetPackagingEmissionsAsync(Guid userId);

        Task<double> GetWasteEmissionsAsync(Guid userId);

        Task<double> GetEnergyEmissionsAsync(Guid userId);

        Task<double> GetPrintingEmissionsAsync(Guid userId);

        Task<Dictionary<string, double>> GetTransportEmissionsByTypeAsync(Guid userId);



    }
}
