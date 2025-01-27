import { User } from "./User";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  signup: (username: string, password: string) => void;
  error: string | null;
}
