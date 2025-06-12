/**
 * AuthService for secure JWT management
 *
 * Features:
 * - Secure storage and retrieval of JWT tokens
 * - Proactive token refresh before expiration
 * - Event-driven architecture for auth state changes
 * - Integration with ApiClient for authenticated requests
 */

import { ApiClient, AuthenticationError } from '../api/ApiClient';

export interface TokenData {
  token: string;
  refreshToken?: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export interface RefreshResponse {
  token: string;
  refreshToken?: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export type AuthEventType = 'login' | 'logout' | 'refresh' | 'expired';

export interface AuthEvent {
  type: AuthEventType;
  data?: TokenData | null;
}

export type AuthEventListener = (event: AuthEvent) => void;

interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

export class AuthService {
  private static instance: AuthService | null = null;
  private tokenData: TokenData | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private apiClient: ApiClient;
  private eventListeners: AuthEventListener[] = [];

  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'currentUser';
  private readonly REFRESH_BUFFER_MS = 5 * 60 * 1000;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
    this.apiClient.setAuthTokenProvider(() => this.getToken());
    this.loadStoredToken();
  }

  /**
   * Get singleton instance of AuthService
   */
  static getInstance(apiClient?: ApiClient): AuthService {
    if (!AuthService.instance) {
      if (!apiClient) {
        throw new Error('ApiClient must be provided when creating AuthService instance');
      }
      AuthService.instance = new AuthService(apiClient);
    }
    return AuthService.instance;
  }

  /**
   * Add event listener for auth state changes
   */
  addEventListener(listener: AuthEventListener): void {
    this.eventListeners.push(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: AuthEventListener): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * Emit auth event to all listeners
   */
  private emitEvent(event: AuthEvent): void {
    this.eventListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in auth event listener:', error);
      }
    });
  }

  /**
   * Load stored token from localStorage and validate
   */
  private loadStoredToken(): void {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userData = localStorage.getItem(this.USER_KEY);

      if (token && userData) {
        const user = JSON.parse(userData);

        const payload = this.parseJWTPayload(token);
        const expiresAt = payload?.exp ? payload.exp * 1000 : Date.now() + 24 * 60 * 60 * 1000;

        this.tokenData = {
          token,
          expiresAt,
          user
        };

        if (this.isTokenExpired()) {
          this.clearStoredToken();
          this.emitEvent({ type: 'expired' });
        } else {
          this.scheduleTokenRefresh();
          this.emitEvent({ type: 'login', data: this.tokenData });
        }
      }
    } catch (error) {
      console.error('Error loading stored token:', error);
      this.clearStoredToken();
    }
  }

  /**
   * Parse JWT payload to extract claims
   */
  private parseJWTPayload(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decoded = atob(payload);
      return JSON.parse(decoded) as JWTPayload;
    } catch {
      return null;
    }
  }

  /**
   * Check if current token is expired
   */
  private isTokenExpired(): boolean {
    if (!this.tokenData) return true;
    return Date.now() >= this.tokenData.expiresAt;
  }

  /**
   * Check if token needs refresh (within buffer time)
   */
  private shouldRefreshToken(): boolean {
    if (!this.tokenData) return false;
    return Date.now() >= this.tokenData.expiresAt - this.REFRESH_BUFFER_MS;
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(): void {
    this.clearRefreshTimer();

    if (!this.tokenData) return;

    const refreshTime = this.tokenData.expiresAt - this.REFRESH_BUFFER_MS;
    const delay = Math.max(0, refreshTime - Date.now());

    this.refreshTimer = setTimeout(() => {
      this.refreshToken().catch((error) => {
        console.error('Automatic token refresh failed:', error);
        this.logout();
      });
    }, delay);
  }

  /**
   * Clear refresh timer
   */
  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Store token and user data securely
   */
  private storeToken(tokenData: TokenData): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, tokenData.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(tokenData.user));
      this.tokenData = tokenData;
      this.scheduleTokenRefresh();
    } catch (error) {
      console.error('Error storing token:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  /**
   * Clear stored token and user data
   */
  private clearStoredToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.tokenData = null;
    this.clearRefreshTimer();
  }

  /**
   * Set authentication data after login
   */
  setAuth(tokenData: TokenData): void {
    this.storeToken(tokenData);
    this.emitEvent({ type: 'login', data: tokenData });
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    if (!this.tokenData || this.isTokenExpired()) {
      return null;
    }
    return this.tokenData.token;
  }

  /**
   * Get current user data
   */
  getUser(): TokenData['user'] | null {
    return this.tokenData?.user || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.tokenData !== null && !this.isTokenExpired();
  }

  /**
   * Check if user has admin role
   */
  isAdmin(): boolean {
    return this.tokenData?.user?.role === 'admin';
  }

  /**
   * Refresh the current token
   */
  async refreshToken(): Promise<void> {
    if (!this.tokenData) {
      throw new AuthenticationError('No token to refresh');
    }

    try {
      const response = await this.apiClient.post<RefreshResponse>('/api/auth/refresh', {
        refreshToken: this.tokenData.refreshToken
      });

      const newTokenData: TokenData = {
        token: response.data.token,
        refreshToken: response.data.refreshToken || this.tokenData.refreshToken,
        expiresAt: response.data.expiresAt,
        user: response.data.user
      };

      this.storeToken(newTokenData);
      this.emitEvent({ type: 'refresh', data: newTokenData });
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      throw error;
    }
  }

  /**
   * Logout and clear authentication data
   */
  logout(): void {
    this.clearStoredToken();
    this.emitEvent({ type: 'logout' });

    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  /**
   * Force token expiration (for testing or manual invalidation)
   */
  expireToken(): void {
    if (this.tokenData) {
      this.tokenData.expiresAt = Date.now() - 1;
    }
    this.logout();
    this.emitEvent({ type: 'expired' });

    window.dispatchEvent(new CustomEvent('auth:expired'));
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(): Date | null {
    return this.tokenData ? new Date(this.tokenData.expiresAt) : null;
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiration(): number {
    if (!this.tokenData) return 0;
    return Math.max(0, this.tokenData.expiresAt - Date.now());
  }

  /**
   * Check if token should be refreshed and do so if needed
   */
  async ensureValidToken(): Promise<string | null> {
    if (!this.tokenData) return null;

    if (this.isTokenExpired()) {
      this.logout();
      return null;
    }

    if (this.shouldRefreshToken()) {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }

    return this.getToken();
  }
}
