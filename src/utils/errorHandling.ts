
import { toast } from 'sonner';

interface ErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  severity?: 'error' | 'warning' | 'info';
}

/**
 * Centralized error handling function
 * @param error The error object
 * @param message User-friendly error message
 * @param options Additional options for error handling
 */
export const handleError = (
  error: unknown, 
  message: string = 'Une erreur est survenue', 
  options: ErrorOptions = { showToast: true, logToConsole: true, severity: 'error' }
) => {
  // Get detailed error information
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  
  // Display toast notification if enabled
  if (options.showToast) {
    if (options.severity === 'error') {
      toast.error(message, {
        description: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      });
    } else if (options.severity === 'warning') {
      toast.warning(message);
    } else {
      toast.info(message);
    }
  }
  
  // Log to console if enabled
  if (options.logToConsole) {
    console.group('Application Error');
    console.error(`Error: ${message}`);
    console.error(`Details: ${errorMessage}`);
    if (stack && process.env.NODE_ENV === 'development') {
      console.error('Stack:', stack);
    }
    console.groupEnd();
  }
  
  // Return the error for further handling if needed
  return {
    error,
    message,
    details: errorMessage,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined
  };
};

/**
 * Async function wrapper with error handling
 * @param fn Async function to execute
 * @param errorMessage Custom error message if the function fails
 */
export const withErrorHandling = async <T,>(
  fn: () => Promise<T>,
  errorMessage: string = 'Une erreur est survenue'
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error, errorMessage);
    return null;
  }
};

/**
 * Check if a value is defined (not null or undefined)
 * @param value Value to check
 * @param name Name of the value for error message
 */
export const assertDefined = <T,>(value: T | null | undefined, name: string): T => {
  if (value === null || value === undefined) {
    const error = new Error(`${name} is required but was not provided`);
    handleError(error, `Erreur de configuration: ${name} manquant`);
    throw error;
  }
  return value;
};
