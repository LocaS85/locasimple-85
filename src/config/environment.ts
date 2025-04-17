
// Environment Variables

// Mapbox Access Token
export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Google Maps API Key (if used)
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Environment settings
export const IS_DEVELOPMENT = import.meta.env.DEV || process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = import.meta.env.PROD || process.env.NODE_ENV === 'production';

// Feature flags
export const FEATURES = {
  USE_FLASK_SERVER: true,
  USE_MAPBOX: true,
  ENABLE_VOICE_SEARCH: true,
  ENABLE_CATEGORIES: true,
  ENABLE_SUBCATEGORIES: true
};

// Utility to check if API keys are valid
export const isApiKeyValid = (key: string | undefined): boolean => {
  return !!key && key.length > 0 && key !== 'YOUR_MAPBOX_ACCESS_TOKEN';
};
