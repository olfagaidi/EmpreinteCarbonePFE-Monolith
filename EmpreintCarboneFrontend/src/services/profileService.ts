import api from "./api";
import { AccountFormValues } from "@/components/auth/AccountSettings"; 
import { User } from "@/models/auth"; // ou adapte le chemin si besoin

export const profileService = {
  async updateProfile(data: AccountFormValues): Promise<void> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // ✅ assure que `photo` est bien une string base64 (si existante)
    if (data.photo) {
      formData.append("photo", data.photo);
    }

    await api.put("/Auth/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/Auth/me");
    return response.data;
  },
};
