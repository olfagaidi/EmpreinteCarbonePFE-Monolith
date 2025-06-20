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
    public class WareHouseDataService : IWareHouseDataService
    {
        private readonly IWarehouseDataRepository _repository;

        public WareHouseDataService(IWarehouseDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<WarehouseDataDto>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.Select(x => new WarehouseDataDto
            {
                Id = x.Id,
                Area = x.Area,
                EnergyType = x.EnergyType,
                EnergyConsumption = x.EnergyConsumption,
                HeatingConsumption = x.HeatingConsumption,
                Emission = x.Emission,
                DateTime = x.DateTime

            });
        }

        public async Task<WarehouseDataDto?> GetByIdAsync(Guid id)
        {
            var x = await _repository.GetByIdAsync(id);
            if (x == null) return null;

            return new WarehouseDataDto
            {
                Id = x.Id,
                Area = x.Area,
                EnergyType = x.EnergyType,
                EnergyConsumption = x.EnergyConsumption,
                HeatingConsumption = x.HeatingConsumption,
                Emission = x.Emission,
                DateTime = x.DateTime
            };
        }

        public async Task AddAsync(WarehouseDataDto dto)
        {
            var entity = new WarehouseData
            {
                Id = Guid.NewGuid(),
         
                Area = dto.Area,
                EnergyType = dto.EnergyType,
                EnergyConsumption = dto.EnergyConsumption,
                HeatingConsumption = dto.HeatingConsumption,
                UserId = dto.UserId,
                Emission = EmissionCalculator.CalculateWareHouseEmission(dto.EnergyConsumption, dto.HeatingConsumption, dto.EnergyType),
                DateTime = dto.DateTime 
            };

            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(WarehouseDataDto dto)
        {
            if (dto.Id == null) throw new ArgumentException("Id is required for update");

            var entity = new WarehouseData
            {
                Id = dto.Id.Value,
                Area = dto.Area,
                EnergyType = dto.EnergyType,
                EnergyConsumption = dto.EnergyConsumption,
                HeatingConsumption = dto.HeatingConsumption,
                UserId = dto.UserId,
                Emission = EmissionCalculator.CalculateWareHouseEmission(dto.EnergyConsumption, dto.HeatingConsumption, dto.EnergyType),
                DateTime = dto.DateTime
            };

            await _repository.UpdateAsync(entity);
        }
        public async Task<IEnumerable<WarehouseDataDto>> GetAllByUserIdAsync(Guid userId)
        {
            var items = await _repository.GetAllByUserIdAsync(userId);
            return items.Select(x => new WarehouseDataDto
            {
                Id = x.Id,
                Area = x.Area,
                EnergyType = x.EnergyType,
                EnergyConsumption = x.EnergyConsumption,
                HeatingConsumption = x.HeatingConsumption,
                Emission = x.Emission,
                DateTime = x.DateTime
            });
        }
        public static double CalculateEmission(WarehouseData dto)
        {
            return EmissionCalculator.CalculateWareHouseEmission(dto.EnergyConsumption, dto.HeatingConsumption, dto.EnergyType);
        }
        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}

