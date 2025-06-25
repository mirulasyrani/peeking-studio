import { useState, useEffect, useCallback, type ReactNode, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthTypes";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (email === "admin@peeking" && password === "password123abc!@#") {
      setIsAuthenticated(true);
      setIsAdmin(true);
      localStorage.setItem("auth", JSON.stringify({ isAuthenticated: true, isAdmin: true }));
      navigate("/admin");
      return true;
    }
    return false;
  }, [navigate]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("auth");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        setIsAuthenticated(!!parsed.isAuthenticated);
        setIsAdmin(!!parsed.isAdmin);
      }
    } catch (e) {
      console.error("Failed to parse auth state from localStorage:", e);
    }
  }, []);

  const contextValue: AuthContextType = { isAuthenticated, isAdmin, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
