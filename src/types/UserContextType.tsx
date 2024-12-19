export interface UserContextType {
  userLogin?: (username: string, password: string) => void;
  createUser?: (username: string, password: string) => void;
  userLogout?: () => void;
  data?: string;
  error?: string | null;
  loading?: boolean;
  login?: boolean;
}
