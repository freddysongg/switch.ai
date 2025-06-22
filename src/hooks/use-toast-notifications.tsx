import { useCallback } from 'react';

import { ToastService } from '@/lib/ToastService.js';

export function useToastNotifications() {
  const showSuccess = useCallback((message: string, duration?: number) => {
    return ToastService.success(message, duration);
  }, []);

  const showError = useCallback((message: string, duration?: number) => {
    return ToastService.error(message, duration);
  }, []);

  const showWarning = useCallback((message: string, duration?: number) => {
    return ToastService.warning(message, duration);
  }, []);

  const showInfo = useCallback((message: string, duration?: number) => {
    return ToastService.info(message, duration);
  }, []);

  const showLoading = useCallback((message: string) => {
    return ToastService.loading(message);
  }, []);

  const showRetryDelay = useCallback((delayMs: number, attemptNumber: number) => {
    return ToastService.showRetryDelay(delayMs, attemptNumber);
  }, []);

  const showRateLimitDelay = useCallback((retryAfterSeconds: number) => {
    return ToastService.showRateLimitDelay(retryAfterSeconds);
  }, []);

  const showAuthEvent = useCallback((type: 'login' | 'logout' | 'refresh' | 'expired') => {
    return ToastService.showAuthEvent(type);
  }, []);

  const showConnectionStatus = useCallback((status: 'online' | 'offline' | 'reconnecting') => {
    return ToastService.showConnectionStatus(status);
  }, []);

  const handleApiError = useCallback((error: Error, showDetail: boolean = false) => {
    return ToastService.handleApiError(error, showDetail);
  }, []);

  const handleError = useCallback(
    (error: unknown, fallbackMessage: string = 'An unexpected error occurred') => {
      if (error instanceof Error) {
        return handleApiError(error);
      } else if (typeof error === 'string') {
        return showError(error);
      } else {
        return showError(fallbackMessage);
      }
    },
    [handleApiError, showError]
  );

  const showUploadProgress = useCallback((filename: string, progress: number) => {
    return ToastService.showUploadProgress(filename, progress);
  }, []);

  const showQueueStatus = useCallback((queueSize: number, activeRequests: number) => {
    return ToastService.showQueueStatus(queueSize, activeRequests);
  }, []);

  const updateToast = useCallback(
    (
      toastId: string,
      message: string,
      type?: 'success' | 'error' | 'warning' | 'info' | 'loading'
    ) => {
      ToastService.update(toastId, message, type);
    },
    []
  );

  const dismissToast = useCallback((toastId: string) => {
    ToastService.dismiss(toastId);
  }, []);

  const dismissAllToasts = useCallback(() => {
    ToastService.dismissAll();
  }, []);

  const withLoadingToast = useCallback(
    async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error?: string;
      }
    ): Promise<T> => {
      const toastId = showLoading(messages.loading);

      try {
        const result = await promise;
        ToastService.update(toastId, messages.success, 'success');
        setTimeout(() => ToastService.dismiss(toastId), 3000);
        return result;
      } catch (error) {
        const errorMessage = messages.error || 'Operation failed';
        ToastService.update(toastId, errorMessage, 'error');
        setTimeout(() => ToastService.dismiss(toastId), 5000);
        throw error;
      }
    },
    [showLoading]
  );

  const withErrorHandling = useCallback(
    async <T,>(
      promise: Promise<T>,
      options?: {
        showSuccess?: boolean;
        successMessage?: string;
        showError?: boolean;
        errorMessage?: string;
      }
    ): Promise<T | null> => {
      try {
        const result = await promise;

        if (options?.showSuccess) {
          showSuccess(options.successMessage || 'Operation completed successfully');
        }

        return result;
      } catch (error) {
        if (options?.showError !== false) {
          if (options?.errorMessage) {
            showError(options.errorMessage);
          } else {
            handleError(error);
          }
        }
        return null;
      }
    },
    [showSuccess, showError, handleError]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,

    showRetryDelay,
    showRateLimitDelay,
    showAuthEvent,
    showConnectionStatus,
    showUploadProgress,
    showQueueStatus,

    handleApiError,
    handleError,

    updateToast,
    dismissToast,
    dismissAllToasts,

    withLoadingToast,
    withErrorHandling
  };
}
