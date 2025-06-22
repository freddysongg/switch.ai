import { AlertCircle, AlertTriangle, Clock, Info, Lock, Shield } from 'lucide-react';

import {
  ApiError,
  AuthenticationError,
  RateLimitError,
  SecurityViolationError,
  ValidationError
} from '@/lib/api/ApiClient';

interface ErrorDetails {
  title: string;
  message: string;
  variant: 'destructive' | 'warning' | 'info' | 'security';
  icon: typeof AlertTriangle;
  showRetry: boolean;
  details?: string[];
  retryAfter?: number;
}

/**
 * Helper function to determine error details based on error type
 */
export function getErrorDetails(error: Error | string): ErrorDetails {
  if (typeof error === 'string') {
    return {
      title: 'Error',
      message: error,
      variant: 'destructive' as const,
      icon: AlertTriangle,
      showRetry: false
    };
  }

  if (error instanceof SecurityViolationError) {
    return {
      title: 'Security Alert',
      message: error.message,
      variant: 'security' as const,
      icon: Shield,
      showRetry: false
    };
  }

  if (error instanceof ValidationError) {
    return {
      title: 'Validation Error',
      message: error.message,
      variant: 'warning' as const,
      icon: AlertCircle,
      showRetry: false,
      details: error.details
    };
  }

  if (error instanceof RateLimitError) {
    return {
      title: 'Rate Limit Exceeded',
      message: error.message,
      variant: 'warning' as const,
      icon: Clock,
      showRetry: true,
      retryAfter: error.retryAfter
    };
  }

  if (error instanceof AuthenticationError) {
    return {
      title: 'Authentication Required',
      message: error.message,
      variant: 'warning' as const,
      icon: Lock,
      showRetry: false
    };
  }

  if (error instanceof ApiError) {
    return {
      title: error.status ? `Error ${error.status}` : 'API Error',
      message: error.message,
      variant:
        error.status && error.status >= 500 ? ('destructive' as const) : ('warning' as const),
      icon: error.status && error.status >= 500 ? AlertTriangle : Info,
      showRetry: !!(error.status && error.status >= 500)
    };
  }

  if (error instanceof Error) {
    return {
      title: 'Unexpected Error',
      message: error.message || 'An unexpected error occurred',
      variant: 'destructive' as const,
      icon: AlertTriangle,
      showRetry: true
    };
  }

  return {
    title: 'Error',
    message: 'An unknown error occurred',
    variant: 'destructive' as const,
    icon: AlertTriangle,
    showRetry: true
  };
}
