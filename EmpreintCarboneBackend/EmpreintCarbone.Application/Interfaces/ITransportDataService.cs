using EmpreintCarbone.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.Interfaces
{
    public interface ITransportDataService
    {
        Task<IEnumerable<TransportDataDto>> GetAllAsync();
        Task<TransportDataDto?> GetByIdAsync(Guid id);
        Task AddAsync(TransportDataDto dto);
        Task UpdateAsync(TransportDataDto dto);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<TransportDataDto>> GetAllByUserIdAsync(Guid userId);
        double CalculateEmission(TransportDataDto dto);


    }
}
