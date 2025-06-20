using EmpreintCarbone.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Interfaces
{
    public interface IPrintingDataRepository
    {
        Task<IEnumerable<PrintingData>> GetAllAsync();
        Task<PrintingData?> GetByIdAsync(Guid id);
        Task AddAsync(PrintingData data);
        Task UpdateAsync(PrintingData data);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<PrintingData>> GetAllByUserIdAsync(Guid userId);
    }

}
