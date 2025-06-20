using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public byte[]? PasswordHash { get; set; }
        public byte[]? PasswordSalt { get; set; }
        public bool Is_Verified { get; set; } = false;
        public string User_Role { get; set; } = "user";
        public bool Is_Archived { get; set; } = false;

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? JobTitle { get; set; }
        public string? Department { get; set; }
        public string? Location { get; set; }
        public string? Manager { get; set; }
        public byte[]? Photo { get; set; } 


        public ICollection<WasteData>? WasteData { get; set; }


        public ICollection<TransportData>? TransportData { get; set; }

        public ICollection<PrintingData>? PrintingData { get; set; }

        public ICollection<WarehouseData>? WarehouseData { get; set; }
    }
}
