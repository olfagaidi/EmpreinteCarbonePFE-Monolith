
export interface DataEntry {
  transport: TransportData[];
  warehouse: WarehouseData[];
  packaging: PackagingData[];
  waste: WasteData[];
  energy: EnergyData[];
  printing: PrintingData[];
}

export interface TransportData {
  id?: string; 
  distance: number;
  vehicleType: string;
  fuelType: string;
  consumption: number;
  loadFactor: number;
  departureLocation: string;
  arrivalLocation: string;
  UserId?: string;
}


export interface WarehouseData {
  id?: string; 
  area: number;
  energyType: string;
  energyConsumption: number;
  heatingConsumption: number;
   UserId?: string;
}

export interface PackagingData {
  
  id?: string;  
  packagingType?: string;
  quantity: number;
  weight?: number;
  palletCount?: number;
  palletWeight?: number;
  palletType?: string;
   UserId?: string;
}

export interface WasteData {
  id?: string; 
  wasteType?: string;
  quantity: number;
  treatmentMethod?: string;
   UserId?: string;
}

export interface EnergyData {
  id?: string; 
  energyType: string;
  electricityConsumption: number;
  heatingConsumption: number;
  unit?: string;
   UserId?: string;
}

export interface PrintingData {
  id?: string; 
  type?: string;
  printType?: string;
  quantity: number;
  paperType: string;
   UserId?: string;
}