import api from "./api";
import { WarehouseData } from "@/models";

export const warehouseService = {
  getAll: async (): Promise<WarehouseData[]> => {
    const response = await api.get<WarehouseData[]>("/WareHouseDataService");
    return response.data;
  },

  create: async (data: WarehouseData): Promise<WarehouseData> => {
    const response = await api.post<WarehouseData>("/WareHouseDataService", data);
    return response.data;
  },

  update: async (data: WarehouseData): Promise<WarehouseData> => {
    const response = await api.put<WarehouseData>("/WareHouseDataService", data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/WareHouseDataService/${id}`);
  },
};
