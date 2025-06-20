import api from "./api";
import { PackagingData } from "@/models";

export const packagingService = {
  getAll: async (): Promise<PackagingData[]> => {
    const response = await api.get<PackagingData[]>("/PackagingData");
    return response.data;
  },

  create: async (data: PackagingData): Promise<PackagingData> => {
    const response = await api.post<PackagingData>("/PackagingData", data);
    return response.data;
  },

  update: async (data: PackagingData): Promise<PackagingData> => {
  console.log(" Données envoyées au backend :", data); 
  const response = await api.put<PackagingData>("/PackagingData", data); 
  return response.data;
}

,

  remove: async (id: string): Promise<void> => {
    await api.delete(`/PackagingData/${id}`);
  },
};
