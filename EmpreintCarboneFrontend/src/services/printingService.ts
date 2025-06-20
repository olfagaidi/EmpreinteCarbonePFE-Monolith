import api from "./api";
import { PrintingData } from "@/models";

export const printingService = {
  getAll: async (): Promise<PrintingData[]> => {
    const response = await api.get<PrintingData[]>("/PrintingData");
    return response.data;
  },

  create: async (data: PrintingData): Promise<PrintingData> => {
    const response = await api.post<PrintingData>("/PrintingData", data);
    return response.data;
  },

  update: async (data: PrintingData): Promise<PrintingData> => {
    const response = await api.put<PrintingData>("/PrintingData", data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/PrintingData/${id}`);
  },
};
