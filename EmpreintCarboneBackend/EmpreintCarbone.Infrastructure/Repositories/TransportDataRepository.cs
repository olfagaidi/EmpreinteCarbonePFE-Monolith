using EmpreintCarbone.Domain.Entities;
using EmpreintCarbone.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace EmpreintCarbone.Infrastructure.Repositories
{
    public class TransportDataRepository : ITransportDataRepository
    {
        private readonly AppDbContext _context;

        public TransportDataRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TransportData>> GetAllAsync()
            => await _context.TransportData.ToListAsync();

        public async Task<TransportData?> GetByIdAsync(Guid id)
            => await _context.TransportData.FindAsync(id);

        public async Task AddAsync(TransportData data)
        {
            _context.TransportData.Add(data);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TransportData data)
        {
            _context.TransportData.Update(data);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<TransportData>> GetAllByUserIdAsync(Guid userId)
        {
            return await _context.TransportData
                .Where(td => td.UserId == userId)
                .ToListAsync();
        }

        public async Task<Dictionary<string, double>> GetEmissionsByTransportTypeAsync(Guid userId)
        {
            return await _context.TransportData
                .Where(t => t.UserId == userId)
                .GroupBy(t => t.VehicleType)
                .Select(g => new { Type = g.Key, TotalEmission = g.Sum(t => t.Emission) })
                .ToDictionaryAsync(g => g.Type, g => g.TotalEmission);
        }


        public async Task DeleteAsync(Guid id)
        {
            var data = await _context.TransportData.FindAsync(id);
            if (data != null)
            {
                _context.TransportData.Remove(data);
                await _context.SaveChangesAsync();
            }
        }
    }
}
