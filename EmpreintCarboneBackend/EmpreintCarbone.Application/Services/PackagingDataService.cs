using EmpreintCarbone.Application.DTOs;
using EmpreintCarbone.Application.Helpers;
using EmpreintCarbone.Application.Interfaces;
using EmpreintCarbone.Domain.Entities;
using EmpreintCarbone.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.Services
{
    public class PackagingDataService : IPackagingDataService
    {
        private readonly IPackagingDataRepository _repository;

        public PackagingDataService(IPackagingDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PackagingDataDto>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.Select(x => new PackagingDataDto
            {
                Id = x.Id,

                PackagingType = x.PackagingType,
                Weight = x.Weight,
                Quantity = x.Quantity,
                PalletCount = x.PalletCount,
                PalletWeight = x.PalletWeight,
                PalletType = x.PalletType,
                Emission = x.Emission,
                UserId = x.UserId,
                DateTime = x.DateTime

            });
      
        }

        public async Task<PackagingDataDto?> GetByIdAsync(Guid id)
        {
            var x = await _repository.GetByIdAsync(id);
            if (x == null) return null;

            return new PackagingDataDto
            {
                Id = x.Id,
 
                PackagingType = x.PackagingType,
                Weight = x.Weight,
                Quantity = x.Quantity,
                PalletCount = x.PalletCount,
                 PalletWeight = x.PalletWeight,
                PalletType = x.PalletType,
                UserId = x.UserId,
                Emission = x.Emission,
                DateTime = x.DateTime



            };
        }

        public async Task AddAsync(PackagingDataDto dto)
        {
            double emission = 0;
            if (dto.Weight.HasValue && !string.IsNullOrWhiteSpace(dto.PackagingType))
            {
                try
                {
                    emission = EmissionCalculator.CalculatePackagingEmission(dto.Weight.Value, dto.PackagingType);
                }
                catch (ArgumentException ex)
                {
                   Console.WriteLine(ex.Message);   
                }
            }
            var entity = new PackagingData
            {
                Id = Guid.NewGuid(),

                PackagingType = dto.PackagingType,
                Weight = dto.Weight,
                Quantity = dto.Quantity,
                PalletCount = dto.PalletCount,
                PalletWeight = dto.PalletWeight,
                PalletType = dto.PalletType,
                UserId = dto.UserId,
                Emission = emission,
                DateTime = dto.DateTime

            };

            await _repository.AddAsync(entity);
        }


        public async Task UpdateAsync(PackagingDataDto dto)
        {
            if (dto.Id == null) throw new ArgumentException("Id is required for update");

            var existing = await _repository.GetByIdAsync(dto.Id.Value) ?? throw new KeyNotFoundException("PackagingData not found");
            existing.PackagingType = dto.PackagingType;
            existing.Weight = dto.Weight;
            existing.Quantity = dto.Quantity;
            existing.PalletCount = dto.PalletCount;
            existing.PalletWeight = dto.PalletWeight;
            existing.PalletType = dto.PalletType;
            existing.UserId = dto.UserId;
            existing.DateTime = dto.DateTime;

            if (dto.Weight.HasValue && !string.IsNullOrWhiteSpace(dto.PackagingType))
            {
                try
                {
                    existing.Emission = EmissionCalculator.CalculatePackagingEmission(dto.Weight.Value, dto.PackagingType);
                }
                catch (ArgumentException ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            await _repository.UpdateAsync(existing);
        }

        public async Task<IEnumerable<PackagingDataDto>> GetAllByUserIdAsync(Guid userId)
        {
            var items = await _repository.GetAllByUserIdAsync(userId);
            return items.Select(x => new PackagingDataDto
            {
                Id = x.Id,
 
                PackagingType = x.PackagingType,
                Weight = x.Weight,
                Quantity = x.Quantity,
                PalletCount = x.PalletCount,
                PalletWeight = x.PalletWeight,
                PalletType = x.PalletType,
                Emission = x.Emission,
                DateTime = x.DateTime

            });
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
