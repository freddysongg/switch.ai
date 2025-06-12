import { createContext } from 'react';

import { ApiClient } from '@/lib/api/ApiClient';

const apiClient = new ApiClient({
  baseURL: '/api',
  maxConcurrentRequests: 5,
  defaultTimeout: 30000,
  retryAttempts: 3,
  retryDelayMs: 1000
});

export const ApiClientContext = createContext<ApiClient>(apiClient);
export { apiClient };
