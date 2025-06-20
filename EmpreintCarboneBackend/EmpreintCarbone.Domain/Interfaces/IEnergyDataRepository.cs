using EmpreintCarbone.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Interfaces
{
    public interface IEnergyDataRepository
    {
        Task<IEnumerable<EnergyData>> GetAllAsync();
        Task<EnergyData?> GetByIdAsync(Guid id);
        Task AddAsync(EnergyData data);
        Task UpdateAsync(EnergyData data);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<EnergyData>> GetAllByUserIdAsync(Guid userId);
    }

}
