import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { AnalysisResponseWithExtras, AnalyticsEvent, ChatRequest, RateLimit } from '@/types/api.js';
import {
  AuthResponse,
  RegisterResponse,
  UserCredentials,
  UserUpdatePayload
} from '@/types/auth.js';
import { ChatMessage, Conversation, SwitchSearchResult, User } from '@/types/chat.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _retryCount?: number;
  }
}

const RATE_LIMIT_CONFIG = {
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 10000,
  exponentialBase: 2
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ongoingRequests = new Map<string, Promise<any>>();

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (error.response?.status === 401) {
      console.error('API Error: Unauthorized or token expired.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.dispatchEvent(new CustomEvent('auth:expired'));
      return Promise.reject(error);
    }

    if (error.response?.status === 429 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount <= RATE_LIMIT_CONFIG.maxRetries) {
        const retryAfter = error.response.headers['retry-after'];
        const delay = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.min(
              RATE_LIMIT_CONFIG.baseDelay *
                Math.pow(RATE_LIMIT_CONFIG.exponentialBase, originalRequest._retryCount - 1),
              RATE_LIMIT_CONFIG.maxDelay
            );

        console.warn(
          `Rate limit hit, retrying after ${delay}ms (attempt ${originalRequest._retryCount}/${RATE_LIMIT_CONFIG.maxRetries})`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        return apiClient(originalRequest);
      } else {
        console.error('Max retry attempts reached for rate-limited request');
      }
    }

    return Promise.reject(error);
  }
);

async function makeRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  if (ongoingRequests.has(key)) {
    return ongoingRequests.get(key);
  }

  const promise = requestFn().finally(() => {
    ongoingRequests.delete(key);
  });

  ongoingRequests.set(key, promise);
  return promise;
}

export const authApi = {
  register: async (credentials: UserCredentials): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', credentials);
    return data;
  },

  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (data.token && data.user) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new CustomEvent('auth:logout'));
  },

  getMe: async (): Promise<User> => {
    return makeRequest('getMe', async () => {
      const { data } = await apiClient.get<User>('/auth/me');
      return data;
    });
  }
};

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<AnalysisResponseWithExtras> => {
    const body = {
      query: request.message,
      conversationId: request.conversationId,
      preferences: {
        detailLevel: 'detailed' as const,
        technicalDepth: 'advanced' as const,
        includeRecommendations: true as const
      }
    };
    const { data } = await apiClient.post<AnalysisResponseWithExtras>('/analysis/query', body);
    return data;
  },

  getConversation: async (conversationId: string): Promise<ChatMessage[]> => {
    return makeRequest(`getConversation-${conversationId}`, async () => {
      const { data } = await apiClient.get<ChatMessage[]>(`/messages`, {
        params: { conversationId }
      });
      return data;
    });
  },

  listConversations: async (): Promise<Conversation[]> => {
    return makeRequest('listConversations', async () => {
      const { data } = await apiClient.get<Conversation[]>('/conversations');
      return data;
    });
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/conversations/${conversationId}`);
  },

  updateConversation: async (
    conversationId: string,
    payload: { title?: string; category?: string }
  ): Promise<Conversation> => {
    const { data } = await apiClient.put<Conversation>(`/conversations/${conversationId}`, payload);
    return data;
  },

  searchSwitches: async (query: string, limit: number = 5): Promise<SwitchSearchResult[]> => {
    const key = `searchSwitches-${query}-${limit}`;
    return makeRequest(key, async () => {
      const { data } = await apiClient.get<SwitchSearchResult[]>('/chat/switches/search', {
        params: { query, limit }
      });
      return data;
    });
  }
};

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    return makeRequest('getAllUsers', async () => {
      const { data } = await apiClient.get<User[]>('/users');
      return data;
    });
  },

  getUserById: async (id: string): Promise<User> => {
    return makeRequest(`getUserById-${id}`, async () => {
      const { data } = await apiClient.get<User>(`/users/${id}`);
      return data;
    });
  },

  updateUser: async (id: string, payload: UserUpdatePayload): Promise<User> => {
    const { data } = await apiClient.put<User>(`/users/${id}`, payload);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  }
};

export const analyticsApi = {
  getEvents: async (filters: {
    userId?: string;
    eventType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: AnalyticsEvent[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const key = `getEvents-${JSON.stringify(filters)}`;
    return makeRequest(key, async () => {
      const { data } = await apiClient.get('/admin/analytics-events', { params: filters });
      return data;
    });
  }
};

export const rateLimitApi = {
  getRateLimits: async (filters: {
    userId?: string;
    endpoint?: string;
    page?: number;
    limit?: number;
    sortBy?: keyof RateLimit;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: RateLimit[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const key = `getRateLimits-${JSON.stringify(filters)}`;
    return makeRequest(key, async () => {
      const { data } = await apiClient.get('/admin/rate-limits', { params: filters });
      return data;
    });
  }
};
