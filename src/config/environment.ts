
// Détection d'environnement
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Mapbox configuration
export const MAPBOX_TOKEN = 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTlrMjI4dzAwaTNvMmpzZ3o4OHdjcGJxIn0.-BsgOhfBsfiCv1rD0SUKxA';

// Supabase Configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// API URL configuration - Utilisez l'API de prod en production, sinon localhost
export const API_BASE_URL = isDevelopment 
  ? 'http://127.0.0.1:5000' 
  : 'https://api.locasimple.fr';

// Fonction pour vérifier si une API key est valide
export const isApiKeyValid = (key?: string): boolean => {
  return Boolean(key && key.length > 0 && !key.includes('YOUR_'));
};

// Vérification de la présence du token Mapbox
if (!isApiKeyValid(MAPBOX_TOKEN)) {
  console.warn('⚠️ VITE_MAPBOX_TOKEN non défini dans les variables d\'environnement. La carte ne fonctionnera pas correctement.');
  if (isDevelopment) {
    console.info('Pour utiliser Mapbox en développement, créez un fichier .env à la racine du projet avec la variable VITE_MAPBOX_TOKEN=votre_token_mapbox');
  }
}

// Vérification de la configuration Supabase
if (!isApiKeyValid(SUPABASE_URL) || !isApiKeyValid(SUPABASE_ANON_KEY)) {
  console.warn('⚠️ Configuration Supabase incomplète. Certaines fonctionnalités peuvent ne pas fonctionner.');
}

// Exportation des configurations API validées
export const API_CONFIG = {
  mapbox: {
    token: MAPBOX_TOKEN,
    isValid: isApiKeyValid(MAPBOX_TOKEN)
  },
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    isValid: isApiKeyValid(SUPABASE_URL) && isApiKeyValid(SUPABASE_ANON_KEY)
  },
  serverApi: {
    baseUrl: API_BASE_URL
  }
};
