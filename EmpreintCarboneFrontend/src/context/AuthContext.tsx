import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { User, AuthState, UserRole, RegisterUserData } from "@/models";
import { authService } from "@/services/authService"; 
import { profileService } from "@/services/profileService";

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  updatePassword: (newPassword: string) => Promise<boolean>;
  register: (userData: RegisterUserData) => Promise<void>;
  sendResetPasswordLink: (email: string) => Promise<boolean>;
  resetPassword: (email : string ,token: string, newPassword: string) => Promise<boolean>;
  updateAuthState: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//  Compte statique pour démo locale
const DEMO_USERS = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    email: "admin@gmail.com",
    role: "admin" as UserRole,
    company: "TraLIS",
    name: "Admin TraLIS",
    Is_Verified: true,
  },
];
const RESET_TOKENS: Record<string, string> = {};
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
    error: null,
  });

  useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = await profileService.getCurrentUser(); // fonctionne maintenant grâce au token
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          token,
          error: null,
        });
      } catch (error) {
        console.error("Erreur lors de l'authentification :", error);
        logout(); // efface le localStorage si token invalide
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
        error: null,
      });
    }
  };

  initAuth();
}, []);


 const login = async (email: string, password: string): Promise<boolean> => {
  // 1. Statique
  const staticUser = DEMO_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (staticUser) {
    const { password, ...userWithoutPassword } = staticUser;
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    setAuthState({
      user: userWithoutPassword,
      isAuthenticated: true,
      isLoading: false,
      token: null,
      error: null,
    });

    console.log("Utilisateur statique :", userWithoutPassword);
    console.log("Rôle :", userWithoutPassword.role);

    toast.success(`Bienvenue, ${userWithoutPassword.username} !`);
    return true;
  }

  
  try {
  const { user, token } = await authService.login(email, password);
  
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);

  setAuthState({
    user,
    isAuthenticated: true,
    isLoading: false,
    token,
    error: null,
  });

  if (user.Is_Verified === false) {
    toast.info("Première connexion détectée. Veuillez changer votre mot de passe.");
  } else {
    toast.success(`Bienvenue, ${user.username} !`);
  }

  return true;

} catch (error: any) {
  const backendMessage = error?.response?.data;

  if (backendMessage === "Please change your initial password before logging in.") {
    // ✅ Cas spécial : redirection manuelle
    localStorage.setItem("initialLoginEmail", email);
    localStorage.setItem("initialLoginPassword", password);
    toast.info("Veuillez changer votre mot de passe temporaire.");
    window.location.href = "/password-change";
    return false;
  }

  toast.error("Email ou mot de passe incorrect.");
  return false;
}

};



  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      error: null,
    });
    toast.info("Déconnexion réussie.");
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    if (authState.user) {
      // Reconnexion avec le nouvel email et mot de passe
      const { user, token } = await authService.login(authState.user.email, newPassword);

      // Mise à jour de l'utilisateur comme vérifié
      const updatedUser = { ...user, Is_Verified: true };

      // Stockage dans localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("token", token);

      // Mise à jour du contexte d’authentification
      setAuthState({
        user: updatedUser,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success("Mot de passe mis à jour avec succès. Vous êtes maintenant connecté.");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe :", error);
    toast.error("Une erreur est survenue pendant la mise à jour.");
    return false;
  }
};


  const register = async (userData: RegisterUserData): Promise<void> => {
    try {
      await authService.register(userData); 
      toast.success("Utilisateur enregistré avec succès.");
    } catch (error: any) {
      console.error("Erreur lors de l'inscription :", error);
      toast.error("Erreur lors de l'enregistrement.");
      throw error; 
    }
    
  };
  const sendResetPasswordLink = async (email: string): Promise<boolean> => {
    try {
      await authService.sendResetPasswordLink(email); 
      toast.success("Lien de réinitialisation envoyé .");
      return true;
    } catch (error) {
      console.error("Erreur envoi lien :", error);
      toast.error("Impossible d'envoyer le lien de réinitialisation.");
      return false;
    }
  };
  
  const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
): Promise<boolean> => {
  try {
    await authService.resetPassword(email, token, newPassword);
    toast.success("Mot de passe réinitialisé.");
    return true;
  } catch (error) {
    console.error("Erreur réinitialisation :", error);
    toast.error("Échec de la réinitialisation du mot de passe.");
    return false;
  }
};

  
  const isAdmin = (): boolean => {
    return authState.user?.role === "admin";
  };
const updateAuthState = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
  setAuthState((prev) => ({
    ...prev,
    user,
  }));
};

  return (
    <AuthContext.Provider value={{ authState, login, logout, isAdmin, updatePassword, register , sendResetPasswordLink,resetPassword,  updateAuthState, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};