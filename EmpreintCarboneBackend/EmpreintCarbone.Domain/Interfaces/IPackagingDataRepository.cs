using EmpreintCarbone.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Interfaces
{
    public interface IPackagingDataRepository
    {
        Task<IEnumerable<PackagingData>> GetAllAsync();
        Task<PackagingData?> GetByIdAsync(Guid id);
        Task AddAsync(PackagingData data);
        Task UpdateAsync(PackagingData data);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<PackagingData>> GetAllByUserIdAsync(Guid userId);
    }
}
