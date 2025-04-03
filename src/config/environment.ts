
// Détection d'environnement
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Mapbox configuration
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Supabase Configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const API_BASE_URL = isDevelopment 
  ? 'http://127.0.0.1:5000' 
  : 'https://api.locasimple.fr';
