using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.DTOs
{
    public class UserDataDto
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? JobTitle { get; set; }
        public string? Department { get; set; }
        public string? Location { get; set; }
        public string? Manager { get; set; }
        public string? Photo { get; set; }
    }
}
