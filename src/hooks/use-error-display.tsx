import * as React from 'react';

export function useErrorDisplay() {
  const [errors, setErrors] = React.useState<(Error | string)[]>([]);

  const addError = React.useCallback((error: Error | string) => {
    setErrors((prev) => [...prev, error]);
  }, []);

  const removeError = React.useCallback((index: number) => {
    setErrors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearErrors = React.useCallback(() => {
    setErrors([]);
  }, []);

  const hasErrors = errors.length > 0;

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    hasErrors
  };
}
