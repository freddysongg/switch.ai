import { ReactNode, useEffect, useState } from 'react';

import { AuthContext } from '@/hooks/use-auth.js';
import { authApi } from '@/lib/api.js';

import { User } from '@/types/chat.js';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    if (token && storedUser) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Handle auth expiration events
  useEffect(() => {
    const handleAuthExpired = () => {
      setAuthToken(null);
      setCurrentUser(null);
    };

    const handleLogout = () => {
      setAuthToken(null);
      setCurrentUser(null);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const response = await authApi.login({ email, password: pass });
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    setAuthToken(response.token);
    setCurrentUser(response.user as User);
  };

  const register = async (email: string, pass: string, name?: string) => {
    await authApi.register({ email, password: pass, name });
    // Optionally auto-login after registration or prompt user to login
  };

  const logout = () => {
    authApi.logout(); // Clears localStorage items
    setAuthToken(null);
    setCurrentUser(null);
  };

  const isAdmin = (): boolean => {
    return currentUser ? currentUser.role === 'admin' : false;
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, authToken, isLoading, login, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
