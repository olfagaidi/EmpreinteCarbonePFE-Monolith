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
    public class PackagingDataRepository : IPackagingDataRepository
    {
        private readonly AppDbContext _context;

        public PackagingDataRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PackagingData>> GetAllAsync()
            => await _context.PackagingData.ToListAsync();

        public async Task<PackagingData?> GetByIdAsync(Guid id)
            => await _context.PackagingData.FindAsync(id);

        public async Task AddAsync(PackagingData data)
        {
            _context.PackagingData.Add(data);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(PackagingData data)
        {
            _context.PackagingData.Update(data);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<PackagingData>> GetAllByUserIdAsync(Guid userId)
        {
            return await _context.PackagingData
                .Where(td => td.UserId == userId)
                .ToListAsync();
        }


        public async Task DeleteAsync(Guid id)
        {
            var data = await _context.PackagingData.FindAsync(id);
            if (data != null)
            {
                _context.PackagingData.Remove(data);
                await _context.SaveChangesAsync();
            }
        }
    }
}
