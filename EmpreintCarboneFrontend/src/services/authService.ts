import api from "./api";
import { RegisterUserData, User } from "@/models";

export const authService = {
  login: async (
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    console.log("Tentative de login avec :", email, password);
    const response = await api.post<{ token: string }>("/Auth/login", {
      email,
      password,
    });
    

    const token = response.data.token;

    if (!token) {
      throw new Error("Token manquant dans la réponse");
    }
    console.log(" Token reçu :", token); 

    
    const user: User = {
      id: "temp-id",
      username: email.split("@")[0],
      email: email,
      role: email === "olfagaidi89@gmail.com" ? "admin" : "user",
      Is_Verified: true,
    };

    return { user, token };
  },
  sendResetPasswordLink: async (email: string) => {
    return await api.post("/auth/forgot-password", { email });
  },
resetPassword: async (email: string, token: string, newPassword: string) => {
  return await api.post("/Auth/reset-password", {
    email,
    token,
    newPassword
  });
},

  register: async (userData: RegisterUserData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  changeInitialPassword: async (
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<{ user: User; token: string }> => {
  const payload = {
    email,
    oldPassword,
    newPassword,
  };

  console.log("Données envoyées :", payload); // ✅ Debug

  const response = await api.post<{ user: User; token: string }>(
    "/Auth/change-initial-password",
    payload
  );

  return response.data;
},
};