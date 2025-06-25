import { createContext } from "react";

// ✅ Define the type first
export interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// ✅ Create and export the context using the type
export const AuthContext = createContext<AuthContextType | null>(null);
