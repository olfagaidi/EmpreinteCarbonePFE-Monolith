using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpreintCarbone.Application.Helpers
{
    public static class EmissionCalculator
    {
        private static readonly Dictionary<string, double> FuelEmissionFactors = new()
        {
            { "diesel", 2.58 },
            { "essence", 2.31 },
            { "electric", 0.0 },

        };

        private static readonly Dictionary<string, double> WasteEmissionFactors = new()
            {
                { "plastic", 6.0 },
                { "paper", 1.8 },
                { "organic", 0.5 },
                { "glass", 0.2 }
            };

        private static readonly Dictionary<string, double> paperEmissionFactors = new()
            {
                { "standard", 0.005 },
                { "recycled", 0.003 },
                { "photo", 0.01 }
            };

                    private static readonly Dictionary<string, (double electricityFactor, double heatingFactor)> _energyFactors = new()
            {
                { "Electricity", (0.1, 0.05) }, // values in kg CO2e/kWh
                { "Gas",         (0.2, 0.25) },
                { "Oil",         (0.3, 0.35) },
            };


                        private static readonly Dictionary<string, double> PackagingEmissionFactors = new()
                {
                    { "carton", 0.94 },    // kg CO2 / kg
                   { "plastique", 2.5 }   // kg CO2 / kg
                };

        public static double CalculateTransportEmission(double distance, double consumption, string fuelType)
        {
            fuelType = fuelType.ToLower();

            if (!FuelEmissionFactors.TryGetValue(fuelType, out double emissionFactor))
                throw new ArgumentException($"Unsupported fuel type: {fuelType}");

            return ((distance * consumption) / 100.0) * emissionFactor;
        }

        public static double CalculateWasteEmission(double quantity, string wasteType)
        {
            wasteType = wasteType.ToLower();

            if (!WasteEmissionFactors.TryGetValue(wasteType, out double factor))
                throw new ArgumentException($"Unsupported waste type: {wasteType}");

            return quantity * factor;
        }

        public static double CalculatePaperEmission(double quantity, string paperType)
        {
            paperType = paperType.ToLower();
            if (!paperEmissionFactors.TryGetValue(paperType, out double factor))
                throw new ArgumentException($"Unsupported paper type: {paperType}");
            return quantity * factor;
        }
        public static double CalculateWareHouseEmission(double energyConsumption, double heatingConsumption, string EnergyType)
        {
            EnergyType = EnergyType.Trim().ToLowerInvariant();
            string energyKey = char.ToUpper(EnergyType[0]) + EnergyType.Substring(1); 

            if (!_energyFactors.TryGetValue(energyKey, out var factors))
                throw new ArgumentException($"Unsupported energy type: {EnergyType}");

            double electricityEmission = energyConsumption * factors.electricityFactor;
            double heatingEmission = heatingConsumption * factors.heatingFactor;

            return electricityEmission + heatingEmission;
        }

        public static double CalculatePackagingEmission(double weight, string packagingType)
        {
            packagingType = packagingType.ToLowerInvariant();

            if (!PackagingEmissionFactors.TryGetValue(packagingType, out double factor))
                throw new ArgumentException($"Unsupported packaging type: {packagingType}");

            return weight * factor;
        }

    }
}

