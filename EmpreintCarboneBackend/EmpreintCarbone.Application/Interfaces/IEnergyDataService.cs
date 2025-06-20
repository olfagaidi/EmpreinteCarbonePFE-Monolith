using EmpreintCarbone.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.Interfaces
{
    public interface IEnergyDataService
    {
        Task<IEnumerable<EnergyDataDto>> GetAllAsync();
        Task<EnergyDataDto?> GetByIdAsync(Guid id);
        Task AddAsync(EnergyDataDto dto);
        Task UpdateAsync(EnergyDataDto dto);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<EnergyDataDto>> GetAllByUserIdAsync(Guid userId);
    }

}
