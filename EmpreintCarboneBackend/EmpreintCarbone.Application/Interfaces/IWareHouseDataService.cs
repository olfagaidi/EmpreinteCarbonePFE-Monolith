using EmpreintCarbone.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.Interfaces
{
    public interface IWareHouseDataService
    {
        Task<IEnumerable<WarehouseDataDto>> GetAllAsync();
        Task<WarehouseDataDto?> GetByIdAsync(Guid id);
        Task AddAsync(WarehouseDataDto dto);
        Task UpdateAsync(WarehouseDataDto dto);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<WarehouseDataDto>> GetAllByUserIdAsync(Guid userId);
    }
}
