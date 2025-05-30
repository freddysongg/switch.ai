import axios, { AxiosError } from 'axios';

import {
  AuthResponse,
  RegisterResponse,
  UserCredentials,
  UserUpdatePayload
} from '@/types/auth.js';
import {
  AnalyticsEvent,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  Conversation,
  RateLimit,
  SwitchSearchResult,
  User
} from '@/types/chat.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
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

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('API Error: Unauthorized or token expired.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error);
  }
);

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
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  }
};

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const { data } = await apiClient.post<ChatResponse>('/chat', request);
    return data;
  },

  getConversation: async (conversationId: string): Promise<ChatMessage[]> => {
    const { data } = await apiClient.get<ChatMessage[]>(`/chat/${conversationId}`);
    return data;
  },

  listConversations: async (): Promise<Conversation[]> => {
    const { data } = await apiClient.get<Conversation[]>('/conversations');
    return data;
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/conversations/${conversationId}`);
  },

  searchSwitches: async (query: string, limit: number = 5): Promise<SwitchSearchResult[]> => {
    const { data } = await apiClient.get<SwitchSearchResult[]>('/chat/switches/search', {
      params: { query, limit }
    });
    return data;
  }
};

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
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
    const { data } = await apiClient.get('/admin/analytics-events', { params: filters });
    return data;
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
    const { data } = await apiClient.get('/admin/rate-limits', { params: filters });
    return data;
  }
};
