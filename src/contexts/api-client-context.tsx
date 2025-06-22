import { createContext } from 'react';

import { ApiClient } from '@/lib/api/ApiClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = new ApiClient({
  baseURL: API_URL,
  maxConcurrentRequests: 5,
  defaultTimeout: 30000,
  retryAttempts: 3,
  retryDelayMs: 1000
});

export const ApiClientContext = createContext<ApiClient>(apiClient);
export { apiClient };
