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
    public class EnergyDataService : IEnergyDataService
    {
        private readonly IEnergyDataRepository _repository;

        public EnergyDataService(IEnergyDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<EnergyDataDto>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.Select(x => new EnergyDataDto
            {
                Id = x.Id,
                EnergyType = x.EnergyType,
                ElectricityConsumption = x.ElectricityConsumption,
                HeatingConsumption = x.HeatingConsumption,
                Unit = x.Unit,
                UserId = x.UserId,
                Emission = x.Emission,
                DateTime= x.DateTime    

            });
        }

        public async Task<EnergyDataDto?> GetByIdAsync(Guid id)
        {
            var x = await _repository.GetByIdAsync(id);
            return x == null ? null : new EnergyDataDto
            {
                Id = x.Id,
                EnergyType = x.EnergyType,
                ElectricityConsumption = x.ElectricityConsumption,
                HeatingConsumption = x.HeatingConsumption,
                Unit = x.Unit,
                UserId = x.UserId,
                Emission = x.Emission,
                DateTime = x.DateTime
            };
        }

        public async Task AddAsync(EnergyDataDto dto)
        {
            var emission = EmissionCalculator.CalculateWareHouseEmission(
                dto.ElectricityConsumption,
                dto.HeatingConsumption,
                dto.EnergyType
            );

            var entity = new EnergyData
            {
                Id = Guid.NewGuid(),
                EnergyType = dto.EnergyType,
                ElectricityConsumption = dto.ElectricityConsumption,
                HeatingConsumption = dto.HeatingConsumption,
                Unit = dto.Unit,
                UserId = dto.UserId,
                Emission = emission,
                DateTime = dto.DateTime  
            };

            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(EnergyDataDto dto)
        {
            if (dto.Id == null) throw new ArgumentException("Id is required for update");

            var emission = EmissionCalculator.CalculateWareHouseEmission(
                dto.ElectricityConsumption,
                dto.HeatingConsumption,
                dto.EnergyType
            );

            var entity = new EnergyData
            {
                Id = dto.Id.Value,
                EnergyType = dto.EnergyType,
                ElectricityConsumption = dto.ElectricityConsumption,
                HeatingConsumption = dto.HeatingConsumption,
                Unit = dto.Unit,
                UserId = dto.UserId,
                Emission = emission,
                DateTime = dto.DateTime
            };

            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<EnergyDataDto>> GetAllByUserIdAsync(Guid userId)
        {
            var items = await _repository.GetAllByUserIdAsync(userId);
            return items.Select(x => new EnergyDataDto
            {
                Id = x.Id,
                EnergyType = x.EnergyType,
                ElectricityConsumption = x.ElectricityConsumption,
                HeatingConsumption = x.HeatingConsumption,
                Unit = x.Unit,
                UserId = x.UserId,
                Emission = x.Emission,
                DateTime = x.DateTime
            });
        }
    }
}

