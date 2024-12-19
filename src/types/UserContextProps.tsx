export interface UserContextProps {
  userLogin: (username: string, password: string) => Promise<void>;
  createUser: (username: string, password: string) => Promise<void>;
  userLogout: () => Promise<void>;
  data: string | null;
  error: string | null;
  loading: boolean;
  login: boolean | null;
}
