import { ReactNode, useEffect, useState } from 'react';

import { authApi } from '@/lib/api.js';
import { AuthService, TokenData } from '@/lib/auth/AuthService';

import { AuthResponse } from '@/types/auth.js';
import { User } from '@/types/chat.js';

import { apiClient, ApiClientContext } from './api-client-context';
import { AuthContext } from './auth-context';

const authService = AuthService.getInstance(apiClient);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = authService.getUser();
    const token = authService.getToken();

    setCurrentUser(user as User | null);
    setAuthToken(token);

    // Construct tokenData from available information
    if (user && token) {
      const expiresAt =
        authService.getTokenExpiration()?.getTime() || Date.now() + 24 * 60 * 60 * 1000;
      setTokenData({
        token,
        expiresAt,
        user
      });
    } else {
      setTokenData(null);
    }

    setIsLoading(false);

    const handleAuthEvent = (event: { type: string; data?: TokenData | null }) => {
      switch (event.type) {
        case 'login':
        case 'refresh':
          if (event.data) {
            setCurrentUser(event.data.user as User);
            setAuthToken(event.data.token);
            setTokenData(event.data);
          }
          break;
        case 'logout':
        case 'expired':
          setCurrentUser(null);
          setAuthToken(null);
          setTokenData(null);
          break;
      }
    };

    authService.addEventListener(handleAuthEvent);

    return () => {
      authService.removeEventListener(handleAuthEvent);
    };
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const response = (await authApi.login({ email, password: pass })) as AuthResponse;

      const tokenData: TokenData = {
        token: response.token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // Default 24h, will be overridden by JWT parsing
        user: {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || undefined,
          role: response.user.role
        }
      };

      authService.setAuth(tokenData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, pass: string, name?: string) => {
    await authApi.register({ email, password: pass, name });
  };

  const logout = () => {
    authService.logout();
  };

  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  const refreshToken = async (): Promise<void> => {
    try {
      await authService.refreshToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  };

  const getTimeUntilExpiration = (): number => {
    return authService.getTimeUntilExpiration();
  };

  return (
    <ApiClientContext.Provider value={apiClient}>
      <AuthContext.Provider
        value={{
          currentUser,
          authToken,
          tokenData,
          isLoading,
          login,
          register,
          logout,
          isAdmin,
          refreshToken,
          getTimeUntilExpiration
        }}
      >
        {children}
      </AuthContext.Provider>
    </ApiClientContext.Provider>
  );
};
