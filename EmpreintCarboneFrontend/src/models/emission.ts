export interface EmissionFactor {
    id?: string;
    source: string;
    category: string;
    value: number;
    unit: string;
  }
  
  export interface EmissionDetail {
    category: string;
    value: number;
    unit: string;
  }
  
  export interface CarbonFootprint {
    [x: string]: any;
    
    calculationDate: Date;
    totalEmission: number;
    transportEmissions: number;
    warehouseEmissions: number;
    packagingEmissions: number;
    wasteEmissions: number;
    energyEmissions: number;
    details: EmissionDetail[];
  }
  export interface EmissionConfiguration {
    year: string;
    calculationMethod: string;
    scope: string;
    reportingFrequency: string;
    factors: Record<string, EmissionFactor[]>;
  }