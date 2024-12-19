import { AuthContextType } from "@/types/AuthContextType";
import { AuthProviderProps } from "@/types/AuthProviderProps";
import { User } from "@/types/User";
import React, { createContext, useState } from "react";
import { CREATE_POST, LOGIN_POST } from "../services/ApiUsuarios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { url, options } = await LOGIN_POST({ username, password });
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();
      setUser(userData);

      // Store token in localStorage
      localStorage.setItem("authToken", userData.token);

      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setUser(null);
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      const { url, options } = await CREATE_POST({ username, password });
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const userData = await response.json();
      setUser(userData);

      // Store token in localStorage
      localStorage.setItem("authToken", userData.token);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during signup"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
