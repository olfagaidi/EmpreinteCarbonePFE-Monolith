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
    public class PrintingDataService : IPrintingDataService
    {
        private readonly IPrintingDataRepository _repository;

        public PrintingDataService(IPrintingDataRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PrintingDataDto>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();
            return items.Select(x => new PrintingDataDto
            {
                Id = x.Id,
                Type = x.Type,
                PrintType = x.PrintType,
                Quantity = x.Quantity,
                PaperType = x.PaperType,
                UserId = x.UserId,
                Emission = x.Emission,
                DateTime = x.DateTime
            });
        }

        public async Task<PrintingDataDto?> GetByIdAsync(Guid id)
        {
            var x = await _repository.GetByIdAsync(id);
            return x == null ? null : new PrintingDataDto
            {
                Id = x.Id,
                Type = x.Type,
                PrintType = x.PrintType,
                Quantity = x.Quantity,
                PaperType = x.PaperType,
                UserId = x.UserId,
                Emission = x.Emission,
                DateTime = x.DateTime
            };
        }

        public async Task AddAsync(PrintingDataDto dto)
        {
            var entity = new PrintingData
            {
                Id = Guid.NewGuid(),
                Type = dto.Type,
                PrintType = dto.PrintType,
                Quantity = dto.Quantity,
                PaperType = dto.PaperType,
                UserId = dto.UserId,
                Emission = EmissionCalculator.CalculatePaperEmission(dto.Quantity, dto.PaperType),
                DateTime = dto.DateTime
            };

            await _repository.AddAsync(entity);
        }

        public async Task UpdateAsync(PrintingDataDto dto)
        {
            if (dto.Id == null) throw new ArgumentException("Id is required for update");

            var entity = new PrintingData
            {
                Id = dto.Id.Value,
                Type = dto.Type,
                PrintType = dto.PrintType,
                Quantity = dto.Quantity,
                PaperType = dto.PaperType,
                UserId = dto.UserId,
                Emission = EmissionCalculator.CalculatePaperEmission(dto.Quantity, dto.PaperType),
                DateTime = dto.DateTime
            };

            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<PrintingDataDto>> GetAllByUserIdAsync(Guid userId)
        {
            var items = await _repository.GetAllByUserIdAsync(userId);
            return items.Select(x => new PrintingDataDto
            {
                Id = x.Id,
                Type = x.Type,
                PrintType = x.PrintType,
                Quantity = x.Quantity,
                PaperType = x.PaperType,
                UserId = x.UserId,
                Emission = x.Emission,
                DateTime = x.DateTime
            });
        }

        public static double CalculateEmission(PrintingDataDto dto) {
            return EmissionCalculator.CalculatePaperEmission(dto.Quantity, dto.PaperType);
                }
    }

}
