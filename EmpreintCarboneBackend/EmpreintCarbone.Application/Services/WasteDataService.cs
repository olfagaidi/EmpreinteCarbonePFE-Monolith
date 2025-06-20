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
    public class WasteDataService : IWasteDataService
    {
        private readonly IWasteDataRepository _repository;

        public WasteDataService(IWasteDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<WasteDataDto>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.Select(x => new WasteDataDto
            {
                Id = x.Id,
       
                WasteType = x.WasteType,
                Quantity = x.Quantity,
       
                TreatmentMethod = x.TreatmentMethod,
                Emission = x.Emission,
                DateTime = x.DateTime

            });
        }

        public async Task<WasteDataDto?> GetByIdAsync(Guid id)
        {
            var x = await _repository.GetByIdAsync(id);
            if (x == null) return null;

            return new WasteDataDto
            {
                Id = x.Id,
  
                WasteType = x.WasteType,
                Quantity = x.Quantity,
 
                TreatmentMethod = x.TreatmentMethod,
                Emission = x.Emission,
                DateTime = x.DateTime
            };
        }

        public async Task AddAsync(WasteDataDto dto)
        {
            var entity = new WasteData
            {
                Id = Guid.NewGuid(),
       
                WasteType = dto.WasteType,
                Quantity = dto.Quantity,
      
                TreatmentMethod = dto.TreatmentMethod,
                UserId = dto.UserId,
                Emission= EmissionCalculator.CalculateWasteEmission(dto.Quantity, dto.WasteType),
                DateTime = dto.DateTime
            };

            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(WasteDataDto dto)
        {
            if (dto.Id == null) throw new ArgumentException("Id is required for update");

            var entity = new WasteData
            {
                Id = Guid.NewGuid(),
       
                WasteType = dto.WasteType,
                Quantity = dto.Quantity,

                TreatmentMethod = dto.TreatmentMethod,
                UserId = dto.UserId,
                Emission = EmissionCalculator.CalculateWasteEmission(dto.Quantity, dto.WasteType),
                DateTime = dto.DateTime
            };

            await _repository.UpdateAsync(entity);
        }
        public async Task<IEnumerable<WasteDataDto>> GetAllByUserIdAsync(Guid userId)
        {
            var items = await _repository.GetAllByUserIdAsync(userId);
            return items.Select(x => new WasteDataDto
            {
                Id = x.Id,

                WasteType = x.WasteType,
                Quantity = x.Quantity,

                TreatmentMethod = x.TreatmentMethod,
                Emission = x.Emission,
                DateTime = x.DateTime
            });
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public static double CalculateEmission(WasteDataDto dto)
        {
            return EmissionCalculator.CalculateWasteEmission(dto.Quantity, dto.WasteType);
        }
    }
}