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
    public class WasteDataRepository : IWasteDataRepository
    {
        private readonly AppDbContext _context;

        public WasteDataRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WasteData>> GetAllAsync()
            => await _context.WasteData.ToListAsync();

        public async Task<WasteData?> GetByIdAsync(Guid id)
            => await _context.WasteData.FindAsync(id);

        public async Task AddAsync(WasteData data)
        {
            _context.WasteData.Add(data);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(WasteData data)
        {
            _context.WasteData.Update(data);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<WasteData>> GetAllByUserIdAsync(Guid userId)
        {
            return await _context.WasteData
                .Where(td => td.UserId == userId)
                .ToListAsync();
        }


        public async Task DeleteAsync(Guid id)
        {
            var data = await _context.WarehouseData.FindAsync(id);
            if (data != null)
            {
                _context.WarehouseData.Remove(data);
                await _context.SaveChangesAsync();
            }
        }
    }
}
