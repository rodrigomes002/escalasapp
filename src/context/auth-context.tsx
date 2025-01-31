import { useRouter } from "@/routes/hooks";
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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    localStorage.removeItem("authToken");

    const { url, body } = LOGIN_USUARIO({ username, password });
    axios
      .post(url, body)
      .then((response) => {
        const userData = response.data;
        setUser(userData);
        setIsAuthenticated(true);

        localStorage.setItem("authToken", userData.token);

        router.push("/");
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const signup = (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    const { url, body } = CREATE_USUARIO({ username, password });
    axios
      .post(url, body)
      .then((response) => {
        const userData = response.data;
        setUser(userData);

        router.push("/login");
      })
      .catch((error) => {
        const errorData = error.response.data.errors[0];
        setError(errorData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = () => {
    try {
      setIsLoading(true);
      setError(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const AutoLogin = () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      const { url, body, headers } = VALIDATE_TOKEN(token);
      axios
        .post(url, body, { headers: headers })
        .then((response) => {
          const isValid = response.data;

          if (!isValid) {
            logout();
            return;
          }

          router.push("/escalas");
          setIsAuthenticated(true);
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    AutoLogin();
    setIsLoading(false);
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
