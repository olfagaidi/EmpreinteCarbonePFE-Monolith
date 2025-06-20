using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.DTOs
{
    public class PrintingDataDto
    {
        public Guid? Id { get; set; }
        public string? Type { get; set; }
        public string? PrintType { get; set; }
        public int Quantity { get; set; }
        public string PaperType { get; set; } = null!;

        public Guid UserId { get; set; }
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public double Emission { get; set; }
    }

}
