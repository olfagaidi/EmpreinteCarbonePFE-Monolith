import React, { createContext, useContext, useState } from "react";
import {
  DataEntry,
  TransportData,
  WarehouseData,
  PackagingData,
  WasteData,
  EnergyData,
  PrintingData,
  CarbonFootprint,
  Report,
  EmissionDetail,
  RecommendationItem
} from "../models";
import { toast } from "@/components/ui/sonner";

interface DataContextType {
  currentData: DataEntry;
  savedReports: Report[];
  currentFootprint: CarbonFootprint | null;
  recommendations: RecommendationItem[];
  updateTransportData: (data: DataEntry["transport"]) => void;
  updateWarehouseData: (data: DataEntry["warehouse"]) => void;
  updatePackagingData: (data: DataEntry["packaging"]) => void;
  updateWasteData: (data: DataEntry["waste"]) => void;
  updateEnergyData: (data: DataEntry["energy"]) => void;
  updatePrintingData: (data: DataEntry["printing"]) => void;
  resetData: () => void;
  calculateFootprint: () => Promise<CarbonFootprint>;
  generateReport: () => Promise<Report>;
  saveReport: (report: Report) => void;
  importData: (data: any) => boolean;
}

const initialDataEntry: DataEntry = {
  transport: [],
  warehouse: [],
  packaging: [],
  waste: [],
  energy: [],
  printing: [],
};

const emissionFactors = {
  transport: {
    diesel: 2.58, 
    essence: 2.31,
    electric: 0.0,
    lpg: 1.51,
  },
  energy: {
    electricity: 0.1, 
    gas: 0.2,  
    oil: 0.35,    
  },
  packaging: {
    carton: 0.94,
    plastic: 2.5,
  },
  waste: {
    plastic: 6.0,
    paper: 1.8,
    organic: 0.5,
    glass: 0.2,
  },
  printing: {
    standard: 0.005,
    recycled: 0.003,
    photo: 0.01,
  },
};


const sampleRecommendations: RecommendationItem[] = [
  {
    id: "1",
    category: "Transport",
    description: "Optimiser les itinéraires de livraison pour réduire les distances parcourues.",
    potentialReduction: 15,
    difficulty: "Low",
    timeFrame: "Short-term",
  },
  {
    id: "2",
    category: "Transport",
    description: "Remplacer progressivement la flotte par des véhicules électriques ou hybrides.",
    potentialReduction: 30,
    difficulty: "High",
    timeFrame: "Medium-term",
  },
  {
    id: "3",
    category: "Énergie",
    description: "Passer à des fournisseurs d'énergie renouvelable pour les entrepôts.",
    potentialReduction: 40,
    difficulty: "Medium",
    timeFrame: "Medium-term",
  },
  {
    id: "4",
    category: "Emballage",
    description: "Utiliser des matériaux d'emballage recyclés et recyclables.",
    potentialReduction: 25,
    difficulty: "Low",
    timeFrame: "Short-term",
  },
  {
    id: "5",
    category: "Déchets",
    description: "Mettre en place un système de recyclage plus efficace dans les entrepôts.",
    potentialReduction: 20,
    difficulty: "Medium",
    timeFrame: "Short-term",
  },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentData, setCurrentData] = useState<DataEntry>(initialDataEntry);
  const [savedReports, setSavedReports] = useState<Report[]>([]);
  const [currentFootprint, setCurrentFootprint] = useState<CarbonFootprint | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(sampleRecommendations);

  const updateTransportData = (data: DataEntry["transport"]) => {
    setCurrentData((prev) => ({ ...prev, transport: data }));
  };

  const updateWarehouseData = (data: DataEntry["warehouse"]) => {
    setCurrentData((prev) => ({ ...prev, warehouse: data }));
  };

  const updatePackagingData = (data: DataEntry["packaging"]) => {
    setCurrentData((prev) => ({ ...prev, packaging: data }));
  };

  const updateWasteData = (data: DataEntry["waste"]) => {
    setCurrentData((prev) => ({ ...prev, waste: data }));
  };

  const updateEnergyData = (data: DataEntry["energy"]) => {
    setCurrentData((prev) => ({ ...prev, energy: data }));
  };

  const updatePrintingData = (data: DataEntry["printing"]) => {
    setCurrentData((prev) => ({ ...prev, printing: data }));
  };

  const resetData = () => {
    setCurrentData(initialDataEntry);
    setCurrentFootprint(null);
    toast.info("Données réinitialisées");
  };

  const calculateFootprint = async (): Promise<CarbonFootprint> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let transport = 0, warehouse = 0, packaging = 0, waste = 0, energy = 0, printing = 0;

      currentData.transport.forEach((item) => {
        const type = item.fuelType.toLowerCase();
        const fuelMap = { essence: "essence", diesel: "diesel", electric: "electric", lpg: "lpg" };
        const fuelKey = fuelMap[item.fuelType.toLowerCase()] || item.fuelType.toLowerCase();

        const factor = emissionFactors.transport[fuelKey] ;
        transport += ((item.distance * item.consumption) / 100) * factor;
      });

      currentData.warehouse.forEach((item) => {
        const type = item.energyType.toLowerCase();
        const energyKey = type.charAt(0).toUpperCase() + type.slice(1);
        const energyFactors = {
          Electricity: { electricityFactor: 0.1, heatingFactor: 0.05 },
          Gas: { electricityFactor: 0.2, heatingFactor: 0.25 },
          Oil: { electricityFactor: 0.3, heatingFactor: 0.35 },
        };

        const factors = energyFactors[energyKey];
        if (factors) {
          warehouse += item.energyConsumption * factors.electricityFactor;
          warehouse += item.heatingConsumption * factors.heatingFactor;
        }
      });

      currentData.packaging.forEach((item) => {
        const type = item.packagingType.toLowerCase();
        const factor = emissionFactors.packaging[type] ?? 1;
        const weight = item.weight || 1;
        packaging += weight * factor; 
      });

      currentData.waste.forEach((item) => {
        const type = (item.wasteType || "").toLowerCase(); 
        const factor = emissionFactors.waste[type] ?? 1;
        waste += item.quantity * factor;
      });

      currentData.energy.forEach((item) => {
        const type = item.energyType.toLowerCase();
        const energyKey = type.charAt(0).toUpperCase() + type.slice(1);
        const energyFactors = {
          Electricity: { electricityFactor: 0.1, heatingFactor: 0.05 },
          Gas: { electricityFactor: 0.2, heatingFactor: 0.25 },
          Oil: { electricityFactor: 0.3, heatingFactor: 0.35 },
        };

        const factors = energyFactors[energyKey];
        if (factors) {
          energy += item.electricityConsumption * factors.electricityFactor;
          energy += item.heatingConsumption * factors.heatingFactor;
        }
      });

      currentData.printing.forEach((item) => {
        const type = (item.paperType || item.type || "").toLowerCase();
        const factor = emissionFactors.printing[type] ?? emissionFactors.printing.standard;
        printing += item.quantity * factor;
      });

      const totalEmission = transport + warehouse + packaging + waste + energy + printing;

      const details: EmissionDetail[] = [
        { category: "Transport", value: transport, unit: "kg CO2e" },
        { category: "Entrepôt", value: warehouse, unit: "kg CO2e" },
        { category: "Emballage", value: packaging, unit: "kg CO2e" },
        { category: "Déchets", value: waste, unit: "kg CO2e" },
        { category: "Énergie", value: energy, unit: "kg CO2e" },
        { category: "Impression", value: printing, unit: "kg CO2e" },
      ];

      const footprint: CarbonFootprint = {
        id: Date.now().toString(),
        calculationDate: new Date(),
        totalEmission,
        transportEmissions: transport,
        warehouseEmissions: warehouse,
        packagingEmissions: packaging,
        wasteEmissions: waste,
        energyEmissions: energy,
        printingEmissions: printing,
        details,
      };

      setCurrentFootprint(footprint);
      resolve(footprint);
    }, 2000);
  });
};


  const generateReport = async (): Promise<Report> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentFootprint) {
          throw new Error("Aucun calcul d'empreinte carbone disponible");
        }

        const report: Report = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          carbonFootprint: currentFootprint,
          content: `Rapport d'émissions de CO2 généré le ${new Date().toLocaleDateString('fr-FR')}.\n
          Émissions totales: ${currentFootprint.totalEmission.toFixed(2)} kg CO2e.\n
          Répartition par catégorie:\n
          - Transport: ${currentFootprint.transportEmissions.toFixed(2)} kg CO2e
          - Entrepôt: ${currentFootprint.warehouseEmissions.toFixed(2)} kg CO2e
          - Emballage: ${currentFootprint.packagingEmissions.toFixed(2)} kg CO2e
          - Déchets: ${currentFootprint.wasteEmissions.toFixed(2)} kg CO2e
          - Énergie: ${currentFootprint.energyEmissions.toFixed(2)} kg CO2e
          - Impression: ${currentFootprint.printingEmissions.toFixed(2)} kg CO2e`,
          pdfUrl: "#",
          title: "",
          description: "",
          author: "",
          data: undefined,
          status: "draft"
        };

        resolve(report);
      }, 1000);
    });
  };

  const saveReport = (report: Report) => {
    setSavedReports((prev) => [...prev, report]);
    toast.success("Rapport enregistré avec succès");
  };

  const importData = (data: any): boolean => {
    try {
      setCurrentData(data);
      toast.success("Données importées avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'importation des données:", error);
      toast.error("Erreur lors de l'importation des données");
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        currentData,
        savedReports,
        currentFootprint,
        recommendations,
        updateTransportData,
        updateWarehouseData,
        updatePackagingData,
        updateWasteData,
        updateEnergyData,
        updatePrintingData,
        resetData,
        calculateFootprint,
        generateReport,
        saveReport,
        importData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};