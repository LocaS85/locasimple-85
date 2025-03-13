
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';
import { SearchOptions, SearchResult } from './types';
import { cacheManager } from '@/utils/cacheManager';
import { handleError } from '@/utils/errorHandling';
import { startPerformanceMarker, endPerformanceMarker } from '@/utils/performanceMonitoring';

class MapboxSearchService {
  private token: string;
  private baseUrl: string = 'https://api.mapbox.com';
  private isInitialized: boolean = false;
  private offlineResults: Map<string, SearchResult[]> = new Map();

  constructor() {
    this.token = MAPBOX_TOKEN || '';
    this.initialize();
  }

  /**
   * Initialise le service et vérifie la validité du token
   */
  private initialize() {
    if (this.isInitialized) return;
    
    // Vérification du token à l'initialisation
    if (!this.token) {
      console.error('Mapbox token missing. Search functionality will be limited.');
      toast.error('Clé API Mapbox manquante. La recherche sera limitée.');
    } else {
      console.log('MapboxSearchService initialized with valid token');
      
      // Vérifier la validité du token avec une requête test
      this.verifyToken().then(isValid => {
        if (isValid) {
          console.log('Mapbox token verified successfully');
        } else {
          console.error('Mapbox token is invalid');
          toast.error('Clé API Mapbox invalide. Veuillez vérifier votre configuration.');
        }
      });
    }
    
    // Configurer le mode hors ligne
    this.setupOfflineMode();
    
    this.isInitialized = true;
  }

  /**
   * Vérifie la validité du token Mapbox
   */
  private async verifyToken(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/geocoding/v5/mapbox.places/Paris.json?access_token=${this.token}&limit=1`;
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      console.error('Error verifying Mapbox token:', error);
      return false;
    }
  }

  /**
   * Configure la détection du mode hors ligne
   */
  private setupOfflineMode() {
    window.addEventListener('online', () => {
      console.log('Connection restored. Switching to online mode for Mapbox search.');
    });
    
    window.addEventListener('offline', () => {
      console.log('Connection lost. Switching to offline mode for Mapbox search.');
      toast.warning('Mode hors ligne activé. Les recherches utiliseront les données en cache.');
    });
  }

  /**
   * Checks if the token is defined
   */
  private checkToken(): boolean {
    if (!this.token) {
      console.error('Mapbox token missing for search request');
      toast.error('Clé API Mapbox manquante pour la recherche');
      return false;
    }
    return true;
  }

  /**
   * Vérifier si l'application est en mode hors ligne
   */
  private isOffline(): boolean {
    return !navigator.onLine;
  }

  /**
   * Génère une clé de cache unique pour une recherche
   */
  private getCacheKey(options: SearchOptions): string {
    return `search-${options.query}-${options.proximity?.join(',')}-${options.types?.join(',')}-${options.language}`;
  }

  /**
   * Stocke des résultats pour une utilisation hors ligne
   */
  private saveForOffline(options: SearchOptions, results: SearchResult[]) {
    const key = this.getCacheKey(options);
    this.offlineResults.set(key, results);
    
    // Sauvegarder aussi dans localStorage pour persistance
    try {
      const existingData = localStorage.getItem('mapbox-offline-searches') || '{}';
      const offlineData = JSON.parse(existingData);
      offlineData[key] = {
        results,
        timestamp: Date.now()
      };
      localStorage.setItem('mapbox-offline-searches', JSON.stringify(offlineData));
    } catch (error) {
      console.error('Error saving search results for offline use:', error);
    }
  }

  /**
   * Récupère des résultats sauvegardés pour le mode hors ligne
   */
  private getOfflineResults(options: SearchOptions): SearchResult[] | null {
    const key = this.getCacheKey(options);
    
    // Vérifier d'abord la mémoire
    if (this.offlineResults.has(key)) {
      return this.offlineResults.get(key) || null;
    }
    
    // Sinon vérifier le localStorage
    try {
      const existingData = localStorage.getItem('mapbox-offline-searches');
      if (existingData) {
        const offlineData = JSON.parse(existingData);
        if (offlineData[key] && Date.now() - offlineData[key].timestamp < 7 * 24 * 60 * 60 * 1000) { // 1 semaine
          // Charger en mémoire pour utilisation future
          this.offlineResults.set(key, offlineData[key].results);
          return offlineData[key].results;
        }
      }
    } catch (error) {
      console.error('Error retrieving offline search results:', error);
    }
    
    return null;
  }

  /**
   * Search for places with autocomplete and proximity
   */
  async searchPlaces(options: SearchOptions): Promise<SearchResult[]> {
    const perfMarkerId = `search-${options.query}`;
    startPerformanceMarker(perfMarkerId);
    
    if (!this.checkToken()) return [];
    if (!options.query || options.query.trim() === '') {
      console.warn('Empty search query provided to searchPlaces');
      endPerformanceMarker(perfMarkerId);
      return [];
    }

    // Vérifier le cache d'abord
    const cacheKey = this.getCacheKey(options);
    const cachedResults = cacheManager.get<SearchResult[]>(cacheKey);
    
    if (cachedResults) {
      console.log(`Using cached results for query: ${options.query}`);
      endPerformanceMarker(perfMarkerId);
      return cachedResults;
    }
    
    // Vérifier le mode hors ligne
    if (this.isOffline()) {
      console.log(`Offline mode active, using stored data for query: ${options.query}`);
      const offlineResults = this.getOfflineResults(options);
      if (offlineResults) {
        endPerformanceMarker(perfMarkerId);
        toast.info('Utilisation des données hors ligne');
        return offlineResults;
      } else {
        toast.error('Aucune donnée hors ligne disponible pour cette recherche');
        endPerformanceMarker(perfMarkerId);
        return [];
      }
    }

    try {
      const endpoint = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodeURIComponent(options.query)}.json`;
      
      // Build query parameters
      const params = new URLSearchParams({
        access_token: this.token,
        limit: String(options.limit || 5),
      });

      if (options.proximity) {
        params.append('proximity', `${options.proximity[0]},${options.proximity[1]}`);
      }

      if (options.autocomplete !== undefined) {
        params.append('autocomplete', String(options.autocomplete));
      }

      if (options.types && options.types.length > 0) {
        params.append('types', options.types.join(','));
      }

      if (options.language) {
        params.append('language', options.language);
      }

      if (options.bbox) {
        params.append('bbox', options.bbox.join(','));
      }

      console.log(`Searching places: ${endpoint}?${params.toString().replace(this.token, 'API_KEY_HIDDEN')}`);
      const response = await fetch(`${endpoint}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        console.log(`No results found for query: ${options.query}`);
      } else {
        console.log(`Found ${data.features.length} results for query: ${options.query}`);
      }
      
      const results = data.features || [];
      
      // Mettre en cache les résultats
      cacheManager.set(cacheKey, results, { ttl: 5 * 60 * 1000 }); // 5 minutes
      
      // Sauvegarder pour une utilisation hors ligne
      this.saveForOffline(options, results);
      
      endPerformanceMarker(perfMarkerId);
      return results;
    } catch (error) {
      endPerformanceMarker(perfMarkerId);
      handleError(error, 'Erreur lors de la recherche de lieux');
      return [];
    }
  }
}

export const mapboxSearchService = new MapboxSearchService();
