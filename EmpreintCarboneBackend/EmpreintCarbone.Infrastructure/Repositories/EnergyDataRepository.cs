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
    public class EnergyDataRepository : IEnergyDataRepository
    {
        private readonly AppDbContext _context;

        public EnergyDataRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EnergyData>> GetAllAsync()
            => await _context.EnergyData.ToListAsync();

        public async Task<EnergyData?> GetByIdAsync(Guid id)
            => await _context.EnergyData.FindAsync(id);

        public async Task AddAsync(EnergyData data)
        {
            _context.EnergyData.Add(data);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(EnergyData data)
        {
            _context.EnergyData.Update(data);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var data = await _context.EnergyData.FindAsync(id);
            if (data != null)
            {
                _context.EnergyData.Remove(data);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<EnergyData>> GetAllByUserIdAsync(Guid userId)
        {
            return await _context.EnergyData.Where(x => x.UserId == userId).ToListAsync();
        }
    }
}

