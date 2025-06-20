using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Entities
{
    public class WarehouseData
    {
        public Guid Id { get; set; }
        public double Area { get; set; }
        public string? EnergyType { get; set; }
        public double EnergyConsumption { get; set; }
        public double HeatingConsumption { get; set; }
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public Guid UserId { get; set; }   
        public User? User { get; set; }
        public double Emission { get; set; }
    }

}
