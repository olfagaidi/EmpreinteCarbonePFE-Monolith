using EmpreintCarbone.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task UpdateAsync(User user);

        Task<User?> GetByEmailAsync(string email);
        Task AddAsync(User user);
        Task<bool> ExistsByEmailAsync(string email);

        Task<IEnumerable<User>> GetAllAsync();

        Task DeleteAsync(User user);

        Task<User?> GetByIdAsync(Guid id);
    }
}
