import { useContext } from 'react';

import { ApiClientContext } from '@/contexts/api-client-context.js';
import { ApiClient } from '@/lib/api/ApiClient.js';

/**
 * Custom hook to access the authenticated ApiClient instance
 * This provides a centralized, authenticated HTTP client throughout the app
 */
export const useApiClient = (): ApiClient => {
  const apiClient = useContext(ApiClientContext);

  if (!apiClient) {
    throw new Error('useApiClient must be used within an AuthProvider');
  }

  return apiClient;
};
