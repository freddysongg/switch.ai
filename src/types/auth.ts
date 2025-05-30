import { User } from './chat.js';

export interface UserCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  };
}

export interface RegisterResponse {
  message: string;
  userId: string;
  email: string;
}

export interface UserUpdatePayload {
  name?: string;
  email?: string;
  role?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  authToken: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}
