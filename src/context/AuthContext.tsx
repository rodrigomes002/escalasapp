import {
  CREATE_USUARIO,
  LOGIN_USUARIO,
  VALIDATE_TOKEN,
} from "@/services/ApiUsuarios";
import { AuthContextType } from "@/types/AuthContextType";
import { AuthProviderProps } from "@/types/AuthProviderProps";
import { User } from "@/types/User";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { url, body } = LOGIN_USUARIO({ username, password });
      const response = await axios.post(url, body);

      if (!response) {
        throw new Error("Login failed");
      }

      const userData = await response.data;
      setUser(userData);
      setIsAuthenticated(true);

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
      setIsAuthenticated(false);
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

      const { url, body } = CREATE_USUARIO({ username, password });
      const response = await axios.post(url, body);

      if (!response) {
        throw new Error("Signup failed");
      }

      const userData = await response.data;
      setUser(userData);

      localStorage.setItem("authToken", userData.token);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during signup"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const ValidateLogin = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) return false;

      try {
        setIsLoading(true);
        setError(null);

        const { url, body, headers } = VALIDATE_TOKEN(token);
        const response = await axios.post(url, body, { headers: headers });

        const isValid = await response.data;

        if (!isValid) {
          logout();
          return;
        }

        navigate("/");
        setIsAuthenticated(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during validate"
        );
      } finally {
        setIsLoading(false);
      }
    };

    ValidateLogin();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signup,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
