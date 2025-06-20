using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.DTOs
{
    public class EnergyDataDto
    {
        public Guid? Id { get; set; }
        public string EnergyType { get; set; } = null!;
        public double ElectricityConsumption { get; set; }
        public double HeatingConsumption { get; set; }
        public string? Unit { get; set; }
        public double Emission { get; set; }
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public Guid UserId { get; set; }
    }

}
