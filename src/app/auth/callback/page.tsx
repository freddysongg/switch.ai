import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/contexts/auth-context';
import {
  cleanOAuthParamsFromUrl,
  parseGoogleOAuthCallback,
  validateGoogleOAuthCallback
} from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function GoogleCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasProcessed, setHasProcessed] = useState(false);
  const processingRef = useRef(false);
  const { handleGoogleCallback, authenticateWithToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (hasProcessed || processingRef.current) return;

    const processCallback = async () => {
      try {
        processingRef.current = true;
        setHasProcessed(true);

        const success = searchParams.get('success');
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const message = searchParams.get('message');

        if (success === 'google_oauth' && token) {
          console.log('Processing successful Google OAuth callback with token');

          try {
            await authenticateWithToken(decodeURIComponent(token));

            setStatus('success');
            cleanOAuthParamsFromUrl();

            setTimeout(() => navigate('/chat'), 1500);
            return;
          } catch (error) {
            console.error('Error processing backend OAuth token:', error);
            setStatus('error');
            setErrorMessage('Failed to process authentication token');
            return;
          }
        }

        if (error) {
          setStatus('error');

          if (error === 'account_exists') {
            setErrorMessage(
              message ||
                'An account with this email already exists. Please log in with your password.'
            );
          } else if (error === 'oauth_error') {
            setErrorMessage(message || 'Google OAuth authentication failed');
          } else if (error === 'user_cancelled') {
            setErrorMessage('Authentication was cancelled. Please try again.');
          } else {
            setErrorMessage(message || 'Authentication failed. Please try again.');
          }

          if (error === 'user_cancelled' || error === 'account_exists') {
            setTimeout(() => navigate('/login'), 3000);
          }
          return;
        }

        const oauthParams = parseGoogleOAuthCallback();

        if (!oauthParams) {
          setStatus('error');
          setErrorMessage('Invalid callback URL. No OAuth parameters found.');
          return;
        }

        const validation = validateGoogleOAuthCallback(oauthParams);

        if (!validation.isValid) {
          setStatus('error');
          setErrorMessage(validation.error || 'Invalid OAuth callback');

          if (validation.errorType === 'user_cancelled') {
            setTimeout(() => navigate('/login'), 2000);
          }
          return;
        }

        if (oauthParams.code) {
          await handleGoogleCallback({
            code: oauthParams.code,
            state: oauthParams.state
          });

          setStatus('success');
          cleanOAuthParamsFromUrl();

          setTimeout(() => navigate('/chat'), 1500);
        }
      } catch (error) {
        console.error('OAuth callback processing failed:', error);
        setStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Authentication failed. Please try again.'
        );
      }
    };

    processCallback();
  });

  const handleRetryLogin = () => {
    navigate('/login');
  };

  const handleGoToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {status === 'processing' && 'processing google sign-in...'}
            {status === 'success' && 'sign-in successful!'}
            {status === 'error' && 'sign-in failed'}
          </CardTitle>
          <CardDescription>
            {status === 'processing' && 'please wait while we complete your authentication.'}
            {status === 'success' && 'redirecting you to the chat interface...'}
            {status === 'error' && 'there was an issue with your google sign-in.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {status === 'processing' && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">authenticating...</span>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">welcome to switchai!</p>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ willChange: 'transform' }}
                >
                  <Button
                    onClick={handleGoToChat}
                    className="w-full bg-transparent hover:bg-transparent"
                  >
                    go to chat
                  </Button>
                </motion.div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 text-center">{errorMessage}</p>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ willChange: 'transform' }}
                >
                  <Button
                    onClick={handleRetryLogin}
                    variant="outline"
                    className="w-full bg-transparent hover:bg-transparent"
                  >
                    back to login
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
