using EmpreintCarbone.Domain.Entities;
using EmpreintCarbone.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Infrastructure.Repositories
{
    public class PrintingDataRepository : IPrintingDataRepository
    {
        private readonly AppDbContext _context;

        public PrintingDataRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PrintingData>> GetAllAsync()
            => await _context.PrintingData.ToListAsync();

        public async Task<PrintingData?> GetByIdAsync(Guid id)
            => await _context.PrintingData.FindAsync(id);

        public async Task AddAsync(PrintingData data)
        {
            _context.PrintingData.Add(data);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(PrintingData data)
        {
            _context.PrintingData.Update(data);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var data = await _context.PrintingData.FindAsync(id);
            if (data != null)
            {
                _context.PrintingData.Remove(data);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<PrintingData>> GetAllByUserIdAsync(Guid userId)
        {
            return await _context.PrintingData.Where(x => x.UserId == userId).ToListAsync();
        }
    }

}
