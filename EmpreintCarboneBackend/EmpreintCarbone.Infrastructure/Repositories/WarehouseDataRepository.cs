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
    public class WarehouseDataRepository : IWarehouseDataRepository
    {
        private readonly AppDbContext _context;

        public WarehouseDataRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WarehouseData>> GetAllAsync()
            => await _context.WarehouseData.ToListAsync();

        public async Task<WarehouseData?> GetByIdAsync(Guid id)
            => await _context.WarehouseData.FindAsync(id);

        public async Task AddAsync(WarehouseData data)
        {
            _context.WarehouseData.Add(data);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(WarehouseData data)
        {
            _context.WarehouseData.Update(data);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<WarehouseData>> GetAllByUserIdAsync(Guid userId)
        {
            return await _context.WarehouseData
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
