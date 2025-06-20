using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;


namespace EmpreintCarbone.Application.DTOs
{
    public class UpdateUserDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? JobTitle { get; set; }
        public string? Department { get; set; }
        public string? Location { get; set; }
        public string? Manager { get; set; }
        public IFormFile? Photo { get; set; } 
    }

}
