import api from "./api"; 
import { TransportData } from "@/models";

export const transportService = {
  getAll: async (): Promise<TransportData[]> => {
    const response = await api.get<TransportData[]>("/TransportData");
    return response.data;
  },

  

  create: async (data: TransportData): Promise<TransportData> => {
    const response = await api.post<TransportData>("/TransportData", data);
    return response.data; 
  },
  

  update: async (data: TransportData): Promise<TransportData> => {
    const response = await api.put<TransportData>("/TransportData", data); 
    return response.data;
  },


  remove: async (id: string): Promise<void> => {
    await api.delete(`/TransportData/${id}`);
  },

  
};
