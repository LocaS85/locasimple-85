
// Détection d'environnement
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Mapbox configuration
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Supabase Configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// API URL configuration - Utilisez l'API de prod en production, sinon localhost
export const API_BASE_URL = isDevelopment 
  ? 'http://127.0.0.1:5000' 
  : 'https://api.locasimple.fr';

// Vérification de la présence du token Mapbox
if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
  console.warn('⚠️ VITE_MAPBOX_TOKEN non défini dans les variables d\'environnement. La carte ne fonctionnera pas correctement.');
  if (isDevelopment) {
    console.info('Pour utiliser Mapbox en développement, créez un fichier .env à la racine du projet avec la variable VITE_MAPBOX_TOKEN=votre_token_mapbox');
  }
}
