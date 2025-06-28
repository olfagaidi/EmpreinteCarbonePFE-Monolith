using EmpreintCarbone.Application.DTOs;
using EmpreintCarbone.Application.Interfaces;
using EmpreintCarbone.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmpreintCarbone.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TransportDataController : ControllerBase
    {
        private readonly ITransportDataService _service;

        public TransportDataController(ITransportDataService service)
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
            if (data == null)
                return NotFound();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create(TransportDataDto dto)
        {
            dto.UserId = GetUserId();
            await _service.AddAsync(dto);
            return Ok("Transport data created.");
        }


        [HttpGet("by-user")]
        public async Task<IActionResult> GetAllByUser()
        {
            var userId = GetUserId();
            var data = await _service.GetAllByUserIdAsync(userId);
            return Ok(data);
        }


        [HttpPut]
        public async Task<IActionResult> Update(TransportDataDto dto)
        {
            dto.UserId = GetUserId();
            await _service.UpdateAsync(dto);
            return Ok("Transport data updated.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok("Transport data deleted.");
        }


        //[HttpPost("calculate-emission")]
        //public IActionResult CalculateEmission([FromBody] TransportDataDto dto)
        //{
        //    try
        //    {
        //        var emission = _service.CalculateEmission(dto);
        //        return Ok(new { Emission = emission });
        //    }
        //    catch (ArgumentException ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userIdClaim != null ? Guid.Parse(userIdClaim) : throw new UnauthorizedAccessException("User ID not found in token.");
        }



    }
}