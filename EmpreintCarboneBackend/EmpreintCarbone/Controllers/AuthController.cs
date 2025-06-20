using EmpreintCarbone.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EmpreintCarbone.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using EmpreintCarbone.Application.DTOs;
using System.Security.Claims;

namespace EmpreintCarbone.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly IAuthService _authService;


        public AuthController(IAuthService authService, ITokenService tokenService)
        {
            _authService = authService;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _authService.UserExists(dto.Email))
                return BadRequest("User already exists.");

            var user = await _authService.Register(dto.Username, dto.Email);
            return Ok(user);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _authService.Login(dto.Email, dto.Password);

            if (user == null)
                return Unauthorized("Invalid credentials.");

            if (user.Is_Archived)
                return StatusCode(403, "This account has been archived and can no longer be accessed.");

            if (!user.Is_Verified)
            {
                return Unauthorized("Please change your initial password before logging in.");
            }


            var token = _tokenService.GenerateToken(user);
            return Ok(new { token });
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var result = await _authService.SendPasswordResetEmail(dto.Email);
            if (!result)
                return NotFound("User not found.");
            return Ok("Password reset token sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var result = await _authService.ResetPassword(dto.Email, dto.NewPassword, dto.Token);
            if (!result)
                return BadRequest("Invalid token or email.");
            return Ok("Password reset successfully.");
        }

        [HttpPost("archiver")]
        public async Task<IActionResult> Archiver([FromBody] string email)
        {
            var result = await _authService.Archiver(email);
            if (!result)
                return BadRequest("Invalid token or email.");
            return Ok("User archived successfully.");
        }

        [HttpPost("unarchiver")]
        public async Task<IActionResult> Unarchiver([FromBody] string email)
        {
            var result = await _authService.Unarchiver(email);
            if (!result)
                return BadRequest("Invalid token or email.");
            return Ok("User unarchived successfully.");
        }

        [Authorize]
        [HttpDelete("delete-by-email")]
        public async Task<IActionResult> DeleteAccountByEmail([FromQuery] string email)
        {
            var deletedUser = await _authService.DeleteAccount(email);
            if (deletedUser == null)
                return NotFound("User not found.");

            return Ok($"User with email {email} deleted successfully.");
        }


        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _authService.GetAllAsync();
            return Ok(users);
        }



        [HttpPost("change-initial-password")]
        public async Task<IActionResult> ChangeInitialPassword([FromBody] ChangePasswordDto dto)
        {
            var success = await _authService.ChangeInitialPassword(dto.Email, dto.OldPassword, dto.NewPassword);
            if (!success)
                return BadRequest("Invalid credentials or already verified.");

            return Ok("Password changed successfully. You are now verified.");
        }


        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var result = await _authService.ChangePassword(dto.Email, dto.OldPassword, dto.NewPassword);
            if (!result)
                return BadRequest("Old password is incorrect or user not found.");

            return Ok("Password changed successfully.");
        }

        [Authorize]
        [HttpGet("download-report")]
        public async Task<IActionResult> DownloadReport()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var report = await _authService.GenerateUserEmissionReportAsync(Guid.Parse(userId));

            var fileName = $"EmissionReport_{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";
            return File(report, "application/pdf", fileName);
        }


        [Authorize]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateUserProfile([FromForm] UpdateUserDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var success = await _authService.UpdateUserInfo(Guid.Parse(userId), dto);
            if (!success) return NotFound("User not found");

            return Ok("Profile updated successfully.");
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserInfo()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
                return Unauthorized();

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            return Ok(user);
        }

    }


    public record RegisterDto(string Username, string Email);

    public record LoginDto(string Email, string Password);

    public record ForgotPasswordDto(string Email);
    public record ResetPasswordDto(string Email, string NewPassword, string Token);

}
