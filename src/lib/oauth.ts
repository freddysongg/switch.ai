import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse Google OAuth callback parameters from URL
 * @param url - The callback URL or current location
 * @returns Parsed parameters or null if invalid
 */
export function parseGoogleOAuthCallback(url?: string): {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
} | null {
  try {
    const urlToParse = url || window.location.href;
    const urlObj = new URL(urlToParse);
    const params = urlObj.searchParams;

    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    if (!code && !error) {
      return null;
    }

    return {
      code: code || undefined,
      state: state || undefined,
      error: error || undefined,
      error_description: errorDescription || undefined
    };
  } catch (error) {
    console.error('Failed to parse OAuth callback URL:', error);
    return null;
  }
}

/**
 * Validate Google OAuth callback parameters
 * @param params - The parsed OAuth parameters
 * @returns Validation result with success status and error details
 */
export function validateGoogleOAuthCallback(params: {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}): {
  isValid: boolean;
  error?: string;
  errorType?: 'user_cancelled' | 'access_denied' | 'invalid_request' | 'server_error' | 'unknown';
} {
  if (params.error) {
    const errorType = (() => {
      switch (params.error) {
        case 'access_denied':
          return 'user_cancelled' as const;
        case 'invalid_request':
        case 'invalid_client':
        case 'invalid_grant':
          return 'invalid_request' as const;
        case 'server_error':
        case 'temporarily_unavailable':
          return 'server_error' as const;
        default:
          return 'unknown' as const;
      }
    })();

    const errorMessage =
      params.error_description ||
      (errorType === 'user_cancelled'
        ? 'User cancelled the authentication'
        : errorType === 'invalid_request'
          ? 'Invalid authentication request'
          : errorType === 'server_error'
            ? 'Google authentication server error'
            : 'Unknown authentication error');

    return {
      isValid: false,
      error: errorMessage,
      errorType
    };
  }

  if (!params.code) {
    return {
      isValid: false,
      error: 'Missing authorization code from Google',
      errorType: 'invalid_request'
    };
  }

  return { isValid: true };
}

/**
 * Clean OAuth parameters from current URL
 * This removes OAuth-related query parameters from the browser URL
 */
export function cleanOAuthParamsFromUrl(): void {
  try {
    const url = new URL(window.location.href);
    const paramsToRemove = ['code', 'state', 'error', 'error_description'];

    let hasChanges = false;
    paramsToRemove.forEach((param) => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      window.history.replaceState({}, '', url.toString());
    }
  } catch (error) {
    console.error('Failed to clean OAuth parameters from URL:', error);
  }
}
