using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Entities
{
    public class TransportData
    {
        public Guid Id { get; set; }
        public double Distance { get; set; }
        public string VehicleType { get; set; } = string.Empty;
        public string FuelType { get; set; } = string.Empty;
        public double Consumption { get; set; }
        public double LoadFactor { get; set; }
        public string DepartureLocation { get; set; } = string.Empty;
        public string ArrivalLocation { get; set; } = string.Empty;

        public double Emission { get; set; }

        public Guid UserId { get; set; }

        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public User? User { get; set; }
    }
}
