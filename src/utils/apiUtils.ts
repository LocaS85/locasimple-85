
import { cacheManager } from './cacheManager';
import { handleError } from './errorHandling';
import { MAPBOX_TOKEN } from '@/config/environment';

// Basic request options for fetch
interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  cacheOptions?: {
    enabled: boolean;
    ttl?: number;
  };
}

/**
 * Enhanced fetch function with error handling, authorization and caching
 * @param url Request URL
 * @param options Request options
 * @returns Response data
 */
export const fetchWithErrorHandling = async <T>(
  url: string, 
  options?: RequestOptions
): Promise<T> => {
  const defaultOptions: RequestOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    cacheOptions: {
      enabled: false
    }
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Add authorization if required
  if (mergedOptions.requiresAuth) {
    mergedOptions.headers = {
      ...mergedOptions.headers,
      'Authorization': `Bearer ${MAPBOX_TOKEN}`
    };
  }
  
  // Check cache first if caching is enabled
  const cacheKey = `api:${url}:${JSON.stringify(mergedOptions)}`;
  if (mergedOptions.cacheOptions?.enabled) {
    const cachedResponse = cacheManager.get<T>(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json() as T;
    
    // Save to cache if caching is enabled
    if (mergedOptions.cacheOptions?.enabled) {
      cacheManager.set(cacheKey, data, { 
        ttl: mergedOptions.cacheOptions.ttl || 5 * 60 * 1000 // Default 5 minutes
      });
    }
    
    return data;
  } catch (error) {
    throw handleError(error, 'Error fetching data', { 
      showToast: true, 
      logToConsole: true 
    });
  }
};

/**
 * Check if the Mapbox API token is available
 * @returns true if the token is available
 */
export const isMapboxTokenAvailable = (): boolean => {
  return Boolean(MAPBOX_TOKEN && MAPBOX_TOKEN.length > 0);
};

/**
 * Verify API connections and report status
 * @returns Status of different API connections
 */
export const verifyApiConnections = async (): Promise<Record<string, boolean>> => {
  const status: Record<string, boolean> = {};
  
  // Verify Mapbox Geocoding API
  try {
    if (isMapboxTokenAvailable()) {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/Paris.json?access_token=${MAPBOX_TOKEN}`
      );
      status.mapboxGeocoding = response.ok;
    } else {
      status.mapboxGeocoding = false;
    }
  } catch (error) {
    status.mapboxGeocoding = false;
    console.error('Error verifying Mapbox Geocoding API:', error);
  }
  
  // Verify Mapbox Directions API
  try {
    if (isMapboxTokenAvailable()) {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/2.3522,48.8566;2.2945,48.8584?access_token=${MAPBOX_TOKEN}`
      );
      status.mapboxDirections = response.ok;
    } else {
      status.mapboxDirections = false;
    }
  } catch (error) {
    status.mapboxDirections = false;
    console.error('Error verifying Mapbox Directions API:', error);
  }
  
  return status;
};
