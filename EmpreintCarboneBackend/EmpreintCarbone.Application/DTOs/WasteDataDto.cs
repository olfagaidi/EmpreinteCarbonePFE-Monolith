using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.DTOs
{
    public class WasteDataDto
    {
        public Guid? Id { get; set; }
    
        public string? WasteType { get; set; }
        public double Quantity { get; set; }
        public string? TreatmentMethod { get; set; }
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public double Emission { get; set; }

        public Guid UserId { get; set; }
    }
}
