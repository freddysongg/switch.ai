import { toast } from 'sonner';

import {
  ApiError,
  AuthenticationError,
  RateLimitError,
  SecurityViolationError,
  ValidationError
} from '@/lib/api/ApiClient.js';

export class ToastService {
  private static retryToastId: string | number | null = null;
  private static rateLimitToastId: string | number | null = null;

  /**
   * Show a success toast notification
   */
  static success(message: string, duration?: number): string | number {
    return toast.success(message, {
      duration: duration || 4000
    });
  }

  /**
   * Show an error toast notification
   */
  static error(message: string, duration?: number): string | number {
    return toast.error(message, {
      duration: duration || 6000
    });
  }

  /**
   * Show a warning toast notification
   */
  static warning(message: string, duration?: number): string | number {
    return toast.warning(message, {
      duration: duration || 5000
    });
  }

  /**
   * Show an info toast notification
   */
  static info(message: string, duration?: number): string | number {
    return toast.info(message, {
      duration: duration || 4000
    });
  }

  /**
   * Show a loading toast notification
   */
  static loading(message: string): string | number {
    return toast.loading(message);
  }

  /**
   * Update an existing toast
   */
  static update(
    toastId: string | number,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'loading' = 'info'
  ): void {
    toast[type](message, { id: toastId });
  }

  /**
   * Dismiss a specific toast
   */
  static dismiss(toastId: string | number): void {
    toast.dismiss(toastId);
  }

  /**
   * Dismiss all toasts
   */
  static dismissAll(): void {
    toast.dismiss();
  }

  /**
   * Show a retry delay notification with countdown
   */
  static showRetryDelay(delayMs: number, attemptNumber: number): string | number {
    if (this.retryToastId) {
      this.dismiss(this.retryToastId);
    }

    const delaySeconds = Math.ceil(delayMs / 1000);
    const message = `retrying in ${delaySeconds}s (attempt ${attemptNumber})`;

    this.retryToastId = this.loading(message);

    let remainingSeconds = delaySeconds;
    const countdownInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds > 0 && this.retryToastId) {
        this.update(
          this.retryToastId,
          `retrying in ${remainingSeconds}s (attempt ${attemptNumber})`,
          'loading'
        );
      } else {
        clearInterval(countdownInterval);
        if (this.retryToastId) {
          this.dismiss(this.retryToastId);
          this.retryToastId = null;
        }
      }
    }, 1000);

    return this.retryToastId;
  }

  /**
   * Show a rate limit notification with countdown
   */
  static showRateLimitDelay(retryAfterSeconds: number): string | number {
    if (this.rateLimitToastId) {
      this.dismiss(this.rateLimitToastId);
    }

    const message = `rate limited. retry in ${retryAfterSeconds}s`;

    this.rateLimitToastId = this.warning(message, retryAfterSeconds * 1000);

    let remainingSeconds = retryAfterSeconds;
    const countdownInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds > 0 && this.rateLimitToastId) {
        this.update(
          this.rateLimitToastId,
          `rate limited. retry in ${remainingSeconds}s`,
          'warning'
        );
      } else {
        clearInterval(countdownInterval);
        if (this.rateLimitToastId) {
          this.dismiss(this.rateLimitToastId);
          this.rateLimitToastId = null;
        }
      }
    }, 1000);

    return this.rateLimitToastId;
  }

  /**
   * Show notification for request queue status
   */
  static showQueueStatus(queueSize: number, activeRequests: number): string | number {
    if (queueSize === 0 && activeRequests === 0) {
      return this.success('all requests completed');
    }

    const message =
      queueSize > 0
        ? `${queueSize} requests queued, ${activeRequests} processing`
        : `${activeRequests} requests processing`;

    return this.info(message, 2000);
  }

  /**
   * Show notification for authentication events
   */
  static showAuthEvent(type: 'login' | 'logout' | 'refresh' | 'expired'): string | number {
    switch (type) {
      case 'login':
        return this.success('successfully logged in');
      case 'logout':
        return this.info('logged out');
      case 'refresh':
        return this.info('session refreshed', 2000);
      case 'expired':
        return this.warning('session expired. please log in again');
      default:
        return this.info('authentication event');
    }
  }

  /**
   * Show notification for Google OAuth events
   */
  static showGoogleAuthEvent(
    type: 'initiate' | 'success' | 'cancelled' | 'failed'
  ): string | number {
    switch (type) {
      case 'initiate':
        return this.loading('redirecting to google...');
      case 'success':
        return this.success('successfully signed in with google');
      case 'cancelled':
        return this.info('google sign-in was cancelled');
      case 'failed':
        return this.error('google sign-in failed. please try again.');
      default:
        return this.info('google authentication event');
    }
  }

  /**
   * Handle Google OAuth specific errors with appropriate notifications
   */
  static handleGoogleOAuthError(
    error: Error,
    context: 'initiate' | 'callback' = 'callback'
  ): string | number {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('popup') && errorMessage.includes('blocked')) {
      return this.warning('please allow popups for google sign-in to work', 8000);
    }

    if (errorMessage.includes('access_denied') || errorMessage.includes('cancelled')) {
      return this.showGoogleAuthEvent('cancelled');
    }

    if (errorMessage.includes('invalid_request') || errorMessage.includes('invalid_grant')) {
      return this.error(
        'invalid google authentication request. please try signing in again.',
        6000
      );
    }

    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return this.error(
        'network error during google sign-in. please check your connection and try again.',
        6000
      );
    }

    if (errorMessage.includes('timeout')) {
      return this.error('google sign-in timed out. please try again.', 5000);
    }

    if (context === 'initiate') {
      return this.error(
        'failed to start google sign-in. please refresh the page and try again.',
        6000
      );
    }

    return this.error('google sign-in failed. please try again or use email/password login.', 6000);
  }

  /**
   * Handle API errors with appropriate toast notifications
   */
  static handleApiError(error: Error, showDetail: boolean = false): string | number {
    if (error instanceof SecurityViolationError) {
      return this.error(showDetail ? error.message : 'Security violation detected', 8000);
    }

    if (error instanceof ValidationError) {
      return this.warning(showDetail ? error.message : 'please check your input', 5000);
    }

    if (error instanceof RateLimitError) {
      return this.showRateLimitDelay(error.retryAfter);
    }

    if (error instanceof AuthenticationError) {
      return this.warning('please log in to continue', 6000);
    }

    if (error instanceof ApiError) {
      const message =
        error.status && error.status >= 500
          ? 'server error. please try again later.'
          : showDetail
            ? error.message
            : 'request failed';

      return this.error(message, 5000);
    }

    return this.error(showDetail ? error.message : 'an unexpected error occurred', 5000);
  }

  /**
   * Show connection status notifications
   */
  static showConnectionStatus(status: 'online' | 'offline' | 'reconnecting'): string | number {
    switch (status) {
      case 'online':
        return this.success('back online', 3000);
      case 'offline':
        return this.error('connection lost');
      case 'reconnecting':
        return this.loading('reconnecting...');
      default:
        return this.info('connection status changed');
    }
  }

  /**
   * Show file upload progress (can be updated)
   */
  static showUploadProgress(filename: string, progress: number): string | number {
    const message =
      progress < 100 ? `uploading ${filename}: ${progress}%` : `upload complete: ${filename}`;

    return progress < 100 ? this.loading(message) : this.success(message, 3000);
  }
}
