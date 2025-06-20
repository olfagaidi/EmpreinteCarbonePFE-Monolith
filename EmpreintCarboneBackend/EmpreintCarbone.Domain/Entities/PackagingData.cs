using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Domain.Entities
{
    public class PackagingData
    {
        public Guid Id { get; set; }
        public string? PackagingType { get; set; }
        public double? Weight { get; set; }
        public int Quantity { get; set; }
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        
        public int? PalletCount { get; set; }
        public double? PalletWeight { get; set; }
        public string? PalletType { get; set; }
        public double Emission { get; set; }

        public Guid UserId { get; set; }  
        public User? User { get; set; }   
    }

}
