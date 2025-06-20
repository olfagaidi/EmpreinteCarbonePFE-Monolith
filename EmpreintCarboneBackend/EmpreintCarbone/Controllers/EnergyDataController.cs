using EmpreintCarbone.Application.DTOs;
using EmpreintCarbone.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmpreintCarbone.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EnergyDataController : ControllerBase
    {
        private readonly IEnergyDataService _service;

        public EnergyDataController(IEnergyDataService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var data = await _service.GetByIdAsync(id);
            return data == null ? NotFound() : Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create(EnergyDataDto dto)
        {
            dto.UserId = GetUserId();
            await _service.AddAsync(dto);
            return Ok("Energy data created.");
        }

        [HttpGet("by-user")]
        public async Task<IActionResult> GetAllByUser()
        {
            var userId = GetUserId();
            var data = await _service.GetAllByUserIdAsync(userId);
            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> Update(EnergyDataDto dto)
        {
            dto.UserId = GetUserId();
            await _service.UpdateAsync(dto);
            return Ok("Energy data updated.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok("Energy data deleted.");
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userIdClaim != null ? Guid.Parse(userIdClaim) : throw new UnauthorizedAccessException("User ID not found in token.");
        }
    }

}
