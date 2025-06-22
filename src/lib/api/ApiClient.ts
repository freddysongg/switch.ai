/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Centralized ApiClient for managing all outgoing API requests
 *
 * Features:
 * - Request queue with exponential backoff for rate limiting
 * - Configurable concurrent request limits
 * - Centralized error handling with custom error types
 * - JWT token management integration
 * - Retry logic for failed requests
 * - Toast notifications for user feedback
 */

import { ToastService } from '@/lib/ToastService';

export interface ApiClientConfig {
  baseURL: string;
  maxConcurrentRequests?: number;
  defaultTimeout?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
  enableToastNotifications?: boolean;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface QueuedRequest {
  id: string;
  config: RequestConfig;
  resolve: (value: ApiResponse<any>) => void;
  reject: (error: Error) => void;
  attempts: number;
  maxAttempts: number;
}

export class SecurityViolationError extends Error {
  constructor(
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SecurityViolationError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: string[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Centralized function to handle API responses and parse errors
 * Can be used independently of the ApiClient class
 *
 * @param response - The Response object from fetch
 * @returns Promise<ApiResponse> - Parsed response with data, status, and headers
 * @throws Custom error types based on response status and content
 */
export async function handleApiResponse<T = any>(response: Response): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let responseData: any;
  try {
    const text = await response.text();
    responseData = text ? JSON.parse(text) : null;
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    switch (response.status) {
      case 400: {
        if (responseData?.error === 'INPUT_SANITIZATION_VIOLATION') {
          throw new SecurityViolationError(
            'Your request contains content that cannot be processed for security reasons.',
            responseData
          );
        }
        if (responseData?.error === 'VALIDATION_ERROR') {
          throw new ValidationError(
            responseData.message || 'Invalid input provided',
            responseData.details
          );
        }
        throw new ApiError(responseData?.message || 'Bad request', response.status, responseData);
      }

      case 401:
        throw new AuthenticationError('Authentication required. Please log in.');

      case 403:
        throw new ApiError(
          'Access denied. Insufficient permissions.',
          response.status,
          responseData
        );

      case 429: {
        const retryAfter = parseInt(response.headers.get('retry-after') || '60');
        throw new RateLimitError(
          `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
          retryAfter
        );
      }

      case 500:
        throw new ApiError(
          'Internal server error. Please try again later.',
          response.status,
          responseData
        );

      default:
        throw new ApiError(
          responseData?.message || `Request failed with status ${response.status}`,
          response.status,
          responseData
        );
    }
  }

  return {
    data: responseData,
    status: response.status,
    headers
  };
}

export class ApiClient {
  private config: Required<ApiClientConfig>;
  private requestQueue: QueuedRequest[] = [];
  private activeRequests: Set<string> = new Set();
  private rateLimitDelay: number = 0;
  private getAuthToken?: () => string | null;

  constructor(config: ApiClientConfig) {
    this.config = {
      maxConcurrentRequests: 5,
      defaultTimeout: 30000,
      retryAttempts: 3,
      retryDelayMs: 1000,
      enableToastNotifications: false,
      ...config
    };
  }

  /**
   * Set the authentication token provider function
   */
  setAuthTokenProvider(provider: () => string | null): void {
    this.getAuthToken = provider;
  }

  /**
   * Make an API request with automatic queuing and error handling
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId();
    const maxAttempts = config.retryAttempts ?? this.config.retryAttempts;

    return new Promise((resolve, reject) => {
      const queuedRequest: QueuedRequest = {
        id: requestId,
        config,
        resolve,
        reject,
        attempts: 0,
        maxAttempts
      };

      this.requestQueue.push(queuedRequest);
      this.processQueue();
    });
  }

  /**
   * Process the request queue respecting concurrent limits
   */
  private async processQueue(): Promise<void> {
    if (this.activeRequests.size >= this.config.maxConcurrentRequests) {
      return;
    }

    const request = this.requestQueue.shift();
    if (!request) {
      return;
    }

    this.activeRequests.add(request.id);

    try {
      if (this.rateLimitDelay > 0) {
        await this.delay(this.rateLimitDelay);
        this.rateLimitDelay = 0;
      }

      const response = await this.executeRequest(request);
      request.resolve(response);
    } catch (error) {
      await this.handleRequestError(request, error as Error);
    } finally {
      this.activeRequests.delete(request.id);
      this.processQueue();
    }
  }

  /**
   * Execute a single HTTP request
   */
  private async executeRequest(request: QueuedRequest): Promise<ApiResponse> {
    const { config } = request;
    const timeout = config.timeout ?? this.config.defaultTimeout;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers
    };

    if (this.getAuthToken) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const url = new URL(config.url, this.config.baseURL);
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchConfig: RequestInit = {
        method: config.method,
        headers,
        signal: controller.signal
      };

      if (config.data && config.method !== 'GET') {
        fetchConfig.body = JSON.stringify(config.data);
      }

      const response = await fetch(url.toString(), fetchConfig);
      clearTimeout(timeoutId);

      return await handleApiResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Handle request errors and implement retry logic
   */
  private async handleRequestError(request: QueuedRequest, error: Error): Promise<void> {
    request.attempts++;

    if (error instanceof RateLimitError) {
      this.rateLimitDelay = error.retryAfter * 1000;

      if (this.config.enableToastNotifications) {
        ToastService.showRateLimitDelay(error.retryAfter);
      }

      if (request.attempts < request.maxAttempts) {
        this.requestQueue.unshift(request);
        return;
      }
    }

    if (request.attempts < request.maxAttempts && this.shouldRetry(error)) {
      const delay = this.calculateBackoffDelay(request.attempts);

      if (this.config.enableToastNotifications) {
        ToastService.showRetryDelay(delay, request.attempts);
      }

      await this.delay(delay);

      this.requestQueue.unshift(request);
      return;
    }

    if (this.config.enableToastNotifications) {
      if (
        error instanceof AuthenticationError ||
        error instanceof SecurityViolationError ||
        (error instanceof ApiError && error.status && error.status >= 500)
      ) {
        ToastService.handleApiError(error, false);
      }
    }

    request.reject(error);
  }

  /**
   * Determine if an error should trigger a retry
   */
  private shouldRetry(error: Error): boolean {
    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof SecurityViolationError
    ) {
      return false;
    }

    if (error instanceof ApiError) {
      return error.status ? error.status >= 500 : true;
    }

    return true;
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoffDelay(attempt: number): number {
    const baseDelay = this.config.retryDelayMs;
    const maxDelay = 30000;
    const delay = baseDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, maxDelay);
  }

  /**
   * Utility method to create delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Convenience methods for common HTTP methods
   */
  async get<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  async delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request({ method: 'PATCH', url, data, ...config });
  }

  /**
   * Initiate Google OAuth flow
   * This will redirect the user to Google's consent screen
   */
  initiateGoogleOAuth(): void {
    const authUrl = `${this.config.baseURL}/auth/google`;
    window.location.href = authUrl;
  }

  /**
   * Handle Google OAuth callback
   * This method is typically called after Google redirects back to the application
   * @param code - Authorization code from Google
   * @param state - State parameter for CSRF protection (optional)
   */
  async handleGoogleCallback<T = any>(code: string, state?: string): Promise<ApiResponse<T>> {
    const params: Record<string, string> = { code };
    if (state) {
      params.state = state;
    }

    return this.get<T>('/auth/google/callback', {
      params
    });
  }

  /**
   * Get current user information (requires authentication)
   */
  async getCurrentUser<T = any>(): Promise<ApiResponse<T>> {
    return this.get<T>('/auth/me');
  }

  /**
   * Get current queue status for debugging
   */
  getQueueStatus(): { queueSize: number; activeRequests: number } {
    return {
      queueSize: this.requestQueue.length,
      activeRequests: this.activeRequests.size
    };
  }
}
