using EmpreintCarbone.Application.DTOs;
using EmpreintCarbone.Application.Interfaces;
using EmpreintCarbone.Domain.Entities;
using EmpreintCarbone.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EmpreintCarbone.Application.Helpers;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.Services
{
    public class TransportDataService : ITransportDataService
    {
        private readonly ITransportDataRepository _repository;

        public TransportDataService(ITransportDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TransportDataDto>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.Select(x => new TransportDataDto
            {
                Id = x.Id,
                Distance = x.Distance,
                VehicleType = x.VehicleType,
                FuelType = x.FuelType,
                Consumption = x.Consumption,
                LoadFactor = x.LoadFactor,
                DepartureLocation = x.DepartureLocation,
                ArrivalLocation = x.ArrivalLocation,
                Emission = x.Emission,
                DateTime = x.DateTime

            });
        }

        public async Task<TransportDataDto?> GetByIdAsync(Guid id)
        {
            var x = await _repository.GetByIdAsync(id);
            if (x == null) return null;

            return new TransportDataDto
            {
                Id = x.Id,
                Distance = x.Distance,
                VehicleType = x.VehicleType,
                FuelType = x.FuelType,
                Consumption = x.Consumption,
                LoadFactor = x.LoadFactor,
                DepartureLocation = x.DepartureLocation,
                ArrivalLocation = x.ArrivalLocation,
                Emission = x.Emission,
                DateTime = x.DateTime
            };
        }

        public async Task AddAsync(TransportDataDto dto)
        {
            var entity = new TransportData
            {
                Id = Guid.NewGuid(),
                Distance = dto.Distance,
                VehicleType = dto.VehicleType,
                FuelType = dto.FuelType,
                Consumption = dto.Consumption,
                LoadFactor = dto.LoadFactor,
                DepartureLocation = dto.DepartureLocation,
                ArrivalLocation = dto.ArrivalLocation,
                UserId = dto.UserId,
                Emission = EmissionCalculator.CalculateTransportEmission(dto.Distance, dto.Consumption, dto.FuelType),
                DateTime = dto.DateTime
            };

            await _repository.AddAsync(entity);

     
        }

        public async Task UpdateAsync(TransportDataDto dto)
        {
            if (dto.Id == null) throw new ArgumentException("Id is required for update");

            var entity = await _repository.GetByIdAsync(dto.Id.Value) ?? throw new InvalidOperationException("Transport data not found");
            entity.Distance = dto.Distance;
            entity.VehicleType = dto.VehicleType;
            entity.FuelType = dto.FuelType;
            entity.Consumption = dto.Consumption;
            entity.LoadFactor = dto.LoadFactor;
            entity.DepartureLocation = dto.DepartureLocation;
            entity.ArrivalLocation = dto.ArrivalLocation;
            entity.UserId = dto.UserId;
            entity.Emission = EmissionCalculator.CalculateTransportEmission(dto.Distance, dto.Consumption, dto.FuelType);
            entity.DateTime = dto.DateTime;

            await _repository.UpdateAsync(entity);
        }

        public async Task<IEnumerable<TransportDataDto>> GetAllByUserIdAsync(Guid userId)
        {
            var items = await _repository.GetAllByUserIdAsync(userId);
            return items.Select(x => new TransportDataDto
            {
                Id = x.Id,
                Distance = x.Distance,
                VehicleType = x.VehicleType,
                FuelType = x.FuelType,
                Consumption = x.Consumption,
                LoadFactor = x.LoadFactor,
                DepartureLocation = x.DepartureLocation,
                ArrivalLocation = x.ArrivalLocation,
                Emission = x.Emission,
                DateTime = x.DateTime
            });
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
        public double CalculateEmission(TransportDataDto dto)
        {
            return EmissionCalculator.CalculateTransportEmission(dto.Distance, dto.Consumption, dto.FuelType);
        }
    }
}
