
export type UserRole = 'admin' | 'user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  password: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  role: "admin" | "user";
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  Is_Verified: boolean;
  [key: string]: any;
  archived?: boolean;
  department?: string;
  phone?: string;
  Photo?: string;
  birthDate?: string; // Date de naissance
  jobTitle?: string; // Poste de travail
  location?: string; // Localisation/Bureau
}


export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
}



export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  isAdmin: () => boolean;
  sendResetPasswordLink: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}