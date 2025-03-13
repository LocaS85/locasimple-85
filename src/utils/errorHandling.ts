
import { toast } from 'sonner';
import { appPerformance } from './appPerformanceTracker';

interface ErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  severity?: 'error' | 'warning' | 'info';
  report?: boolean; // Si true, envoyer à un service d'analyse d'erreur
  retry?: {
    callback: () => Promise<any>;
    maxAttempts: number;
  };
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
  options: ErrorOptions = { showToast: true, logToConsole: true, severity: 'error', report: true }
) => {
  // Get detailed error information
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const errorName = error instanceof Error ? error.name : 'UnknownError';
  
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
  
  // Enregistrer dans les statistiques de performance
  appPerformance.trackError(`${errorName}`, errorMessage);
  
  // Retenter l'opération si demandé
  if (options.retry && options.retry.maxAttempts > 0) {
    console.log(`Retrying operation, ${options.retry.maxAttempts} attempts remaining`);
    
    setTimeout(async () => {
      try {
        await options.retry!.callback();
      } catch (retryError) {
        // Récursion avec une tentative de moins
        handleError(retryError, message, {
          ...options,
          retry: {
            callback: options.retry!.callback,
            maxAttempts: options.retry!.maxAttempts - 1
          }
        });
      }
    }, 1000); // Attendre 1 seconde avant de réessayer
  }
  
  // Return the error for further handling if needed
  return {
    error,
    message,
    details: errorMessage,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    name: errorName
  };
};

/**
 * Async function wrapper with error handling
 * @param fn Async function to execute
 * @param errorMessage Custom error message if the function fails
 */
export const withErrorHandling = async <T,>(
  fn: () => Promise<T>,
  errorMessage: string = 'Une erreur est survenue',
  options?: Partial<ErrorOptions>
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error, errorMessage, options);
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

/**
 * Vérifie si une erreur est liée à une perte de connexion
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('network') || 
           error.message.includes('internet') || 
           error.message.includes('connection') ||
           error.message.includes('offline') ||
           !navigator.onLine;
  }
  return !navigator.onLine;
};

/**
 * Wrapper pour gérer spécifiquement les erreurs de réseau
 */
export const withNetworkErrorHandling = async <T,>(
  fn: () => Promise<T>,
  options: {
    offlineMessage?: string;
    onlineMessage?: string;
    offlineFallback?: () => T | Promise<T>;
  } = {}
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (isNetworkError(error)) {
      const message = options.offlineMessage || 'Erreur de connexion réseau';
      handleError(error, message, { severity: 'warning' });
      
      if (options.offlineFallback) {
        return await options.offlineFallback();
      }
    }
    throw error;
  }
};
