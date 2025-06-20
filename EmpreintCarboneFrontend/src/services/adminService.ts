
import api from './api';
import { User } from '@/models';

export const adminService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/Auth/users'); 
    return response.data;
  },
  async deleteUser(email: string): Promise<void> {
  await api.delete(`/Auth/delete-by-email`, { params: { email } });
},

  archiveUser: async (email: string): Promise<void> => {
    await api.post(`/Auth/archiver`, email, {
      headers: { "Content-Type": "application/json" },
    });
  },

  unarchiveUser: async (email: string): Promise<void> => {
    await api.post(`/Auth/unarchiver`, email, {
      headers: { "Content-Type": "application/json" },
    });
  }
};

