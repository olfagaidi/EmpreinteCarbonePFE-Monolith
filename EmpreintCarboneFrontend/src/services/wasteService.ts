import api from "./api";
import { WasteData } from "@/models";

export const wasteService = {
  getAll: async (): Promise<WasteData[]> => {
    const response = await api.get<WasteData[]>("/WasteData");
    return response.data;
  },

  getAllByUser: async (): Promise<WasteData[]> => {
    const response = await api.get<WasteData[]>("/WasteData/by-user");
    return response.data;
  },

  create: async (data: WasteData): Promise<WasteData> => {
    const response = await api.post<WasteData>("/WasteData", data);
    return response.data;
  },

  update: async (data: WasteData): Promise<WasteData> => {
    if (!data.id) throw new Error("ID manquant pour la mise à jour.");
    const response = await api.put<WasteData>("/WasteData", data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/wasteData/${id}`);
  },


};
