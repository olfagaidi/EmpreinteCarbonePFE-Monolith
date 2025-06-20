import api from "./api";
import { EnergyData } from "@/models";

export const energyService = {
  getAll: async (): Promise<EnergyData[]> => {
    const response = await api.get<EnergyData[]>("/EnergyData");
    return response.data;
  },

  create: async (data: EnergyData): Promise<EnergyData> => {
    const response = await api.post<EnergyData>("/EnergyData", data);
    return response.data;
  },

  update: async (data: EnergyData): Promise<EnergyData> => {
    const response = await api.put<EnergyData>("/EnergyData", data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/EnergyData/${id}`);
  },
};
