using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.DTOs
{
    public class TransportDataDto
    {
        public Guid? Id { get; set; }
        public double Distance { get; set; }
        public string VehicleType { get; set; }
        public string FuelType { get; set; }
        public double Consumption { get; set; }
        public double LoadFactor { get; set; }
        public string DepartureLocation { get; set; }
        public string ArrivalLocation { get; set; }
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public double Emission { get; set; }


        public Guid UserId { get; set; }
    }
}
