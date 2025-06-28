using EmpreintCarbone.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Interfaces
{
    public interface ITransportDataRepository
    {
        Task<IEnumerable<TransportData>> GetAllAsync();
        Task<TransportData?> GetByIdAsync(Guid id);
        Task AddAsync(TransportData data);
        Task UpdateAsync(TransportData data);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<TransportData>> GetAllByUserIdAsync(Guid userId);
        Task<Dictionary<string, double>> GetEmissionsByTransportTypeAsync(Guid userId);


    }
}
