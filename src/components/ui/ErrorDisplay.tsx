import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

import { getErrorDetails } from '@/lib/error-utils';
import { cn } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle } from './alert';
import { Button } from './button';

// Component variants
const errorDisplayVariants = cva('transition-all duration-200', {
  variants: {
    variant: {
      destructive: 'border-destructive/50 text-destructive dark:border-destructive',
      warning:
        'border-yellow-500/50 text-yellow-700 dark:text-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20',
      info: 'border-blue-500/50 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20',
      security: 'border-red-600/50 text-red-700 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20'
    }
  },
  defaultVariants: {
    variant: 'destructive'
  }
});

// Error type definitions
export interface ErrorDisplayProps extends VariantProps<typeof errorDisplayVariants> {
  error: Error | string | null;
  title?: string;
  description?: string;
  showRetry?: boolean;
  showDismiss?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({
  error,
  title,
  description,
  showRetry: propShowRetry,
  showDismiss = true,
  onRetry,
  onDismiss,
  className,
  variant: propVariant,
  ...props
}: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  const errorDetails = getErrorDetails(error);
  const finalVariant = propVariant || errorDetails.variant;
  const finalTitle = title || errorDetails.title;
  const finalDescription = description || errorDetails.message;
  const shouldShowRetry = propShowRetry !== undefined ? propShowRetry : errorDetails.showRetry;
  const IconComponent = errorDetails.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Alert
          className={cn(errorDisplayVariants({ variant: finalVariant }), className)}
          {...props}
        >
          <IconComponent className="h-4 w-4" />
          <div className="flex-1">
            <AlertTitle className="flex items-center justify-between">
              <span>{finalTitle}</span>
              {showDismiss && onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 text-current hover:bg-current/10"
                  onClick={onDismiss}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              )}
            </AlertTitle>
            <AlertDescription className="mt-1">
              <div>{finalDescription}</div>

              {/* Show validation details if available */}
              {'details' in errorDetails &&
                errorDetails.details &&
                Array.isArray(errorDetails.details) && (
                  <ul className="mt-2 list-disc list-inside text-xs space-y-1">
                    {errorDetails.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}

              {/* Show retry information for rate limit errors */}
              {'retryAfter' in errorDetails && errorDetails.retryAfter && (
                <div className="mt-2 text-xs">
                  Please wait {errorDetails.retryAfter} seconds before trying again.
                </div>
              )}

              {/* Action buttons */}
              {shouldShowRetry && onRetry && (
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="h-7 px-2 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Try Again
                  </Button>
                </div>
              )}
            </AlertDescription>
          </div>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}

// Convenience component for displaying multiple errors
export interface ErrorListProps {
  errors: (Error | string)[];
  title?: string;
  onRetry?: () => void;
  onDismiss?: (index: number) => void;
  onDismissAll?: () => void;
  className?: string;
}

export function ErrorList({
  errors,
  title = 'Multiple Errors',
  onRetry,
  onDismiss,
  onDismissAll,
  className
}: ErrorListProps) {
  if (!errors || errors.length === 0) {
    return null;
  }

  if (errors.length === 1) {
    return (
      <ErrorDisplay
        error={errors[0]}
        showRetry={!!onRetry}
        onRetry={onRetry}
        onDismiss={onDismissAll}
        className={className}
      />
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Alert className="border-destructive/50 text-destructive dark:border-destructive">
        <AlertTriangle className="h-4 w-4" />
        <div className="flex-1">
          <AlertTitle className="flex items-center justify-between">
            <span>
              {title} ({errors.length})
            </span>
            {onDismissAll && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 text-current hover:bg-current/10"
                onClick={onDismissAll}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Dismiss all</span>
              </Button>
            )}
          </AlertTitle>
          <AlertDescription className="mt-1">
            <div className="space-y-1 text-sm">
              {errors.map((error, index) => {
                const errorDetails = getErrorDetails(error);
                return (
                  <div key={index} className="flex items-start justify-between">
                    <span className="flex-1">{errorDetails.message}</span>
                    {onDismiss && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-2 text-current hover:bg-current/10"
                        onClick={() => onDismiss(index)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Dismiss</span>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {onRetry && (
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={onRetry} className="h-7 px-2 text-xs">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry All
                </Button>
              </div>
            )}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
