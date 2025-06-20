using EmpreintCarbone.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Interfaces
{
    public interface IWarehouseDataRepository
    {
        Task<IEnumerable<WarehouseData>> GetAllAsync();
        Task<WarehouseData?> GetByIdAsync(Guid id);
        Task AddAsync(WarehouseData data);
        Task UpdateAsync(WarehouseData data);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<WarehouseData>> GetAllByUserIdAsync(Guid userId);
    }
}
