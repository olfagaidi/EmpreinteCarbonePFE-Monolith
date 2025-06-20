using EmpreintCarbone.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Interfaces
{
    public interface IWasteDataRepository
    {
        Task<IEnumerable<WasteData>> GetAllAsync();
        Task<WasteData?> GetByIdAsync(Guid id);
        Task AddAsync(WasteData data);
        Task UpdateAsync(WasteData data);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<WasteData>> GetAllByUserIdAsync(Guid userId);
    }
}
