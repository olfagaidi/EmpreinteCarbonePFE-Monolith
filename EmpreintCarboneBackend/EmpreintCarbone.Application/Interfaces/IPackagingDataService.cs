using EmpreintCarbone.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.Interfaces
{
    public interface IPackagingDataService
    {
        Task<IEnumerable<PackagingDataDto>> GetAllAsync();
        Task<PackagingDataDto?> GetByIdAsync(Guid id);
        Task AddAsync(PackagingDataDto dto);
        Task UpdateAsync(PackagingDataDto dto);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<PackagingDataDto>> GetAllByUserIdAsync(Guid userId);
    }
}
