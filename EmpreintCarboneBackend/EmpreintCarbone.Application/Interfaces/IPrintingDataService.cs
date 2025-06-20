using EmpreintCarbone.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.Interfaces
{
    public interface IPrintingDataService
    {
        Task<IEnumerable<PrintingDataDto>> GetAllAsync();
        Task<PrintingDataDto?> GetByIdAsync(Guid id);
        Task AddAsync(PrintingDataDto dto);
        Task UpdateAsync(PrintingDataDto dto);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<PrintingDataDto>> GetAllByUserIdAsync(Guid userId);
    }

}
