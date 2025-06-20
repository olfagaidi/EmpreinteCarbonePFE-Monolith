using EmpreintCarbone.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.Interfaces
{
    public interface IWasteDataService
    {
   Task<IEnumerable<WasteDataDto>> GetAllAsync();
        Task<WasteDataDto?> GetByIdAsync(Guid id);
        Task AddAsync(WasteDataDto dto);
        Task UpdateAsync(WasteDataDto dto);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<WasteDataDto>> GetAllByUserIdAsync(Guid userId);
    }
}
