
import { cacheManager } from './cacheManager';

interface AppPerformance {
  startupTime: number;
  routeLoadTimes: Record<string, number[]>;
  apiResponseTimes: Record<string, number[]>;
  mapRenderTimes: number[];
  searchResponseTimes: number[];
  eventCounts: Record<string, number>;
  errors: Array<{
    time: number;
    context: string;
    message: string;
  }>;
}

/**
 * Service centralisant le suivi des performances de l'application
 */
class AppPerformanceTracker {
  private performance: AppPerformance;
  private startTime: number;
  private markTimers: Record<string, number> = {};
  private isOffline: boolean = false;

  constructor() {
    this.startTime = performance.now();
    this.performance = this.getInitialPerformance();
    
    // Observer les changements de connectivité
    this.setupConnectivityObserver();
    
    // Enregistrer le temps de démarrage
    window.addEventListener('load', () => {
      this.performance.startupTime = performance.now() - this.startTime;
      this.savePerformanceData();
    });
  }

  /**
   * Surveillance des changements de connectivité
   */
  private setupConnectivityObserver() {
    window.addEventListener('online', () => {
      this.isOffline = false;
      this.trackEvent('connection_restored');
    });
    
    window.addEventListener('offline', () => {
      this.isOffline = true;
      this.trackEvent('connection_lost');
    });
  }

  /**
   * Initialisation de la structure de données des performances
   */
  private getInitialPerformance(): AppPerformance {
    const storedPerformance = localStorage.getItem('app_performance');
    
    if (storedPerformance) {
      try {
        return JSON.parse(storedPerformance);
      } catch (error) {
        console.error('Error parsing stored performance data:', error);
      }
    }
    
    return {
      startupTime: 0,
      routeLoadTimes: {},
      apiResponseTimes: {},
      mapRenderTimes: [],
      searchResponseTimes: [],
      eventCounts: {},
      errors: []
    };
  }

  /**
   * Sauvegarde des données de performance
   */
  private savePerformanceData() {
    try {
      localStorage.setItem('app_performance', JSON.stringify(this.performance));
    } catch (error) {
      console.error('Error saving performance data:', error);
    }
  }

  /**
   * Démarre un chronomètre pour une opération
   */
  startTimer(name: string): void {
    this.markTimers[name] = performance.now();
  }

  /**
   * Arrête un chronomètre et enregistre la durée
   */
  endTimer(name: string, category: 'route' | 'api' | 'map' | 'search' = 'api'): number | undefined {
    const startTime = this.markTimers[name];
    if (!startTime) {
      console.warn(`No timer found with name: ${name}`);
      return undefined;
    }
    
    const duration = performance.now() - startTime;
    
    // Enregistrer selon la catégorie
    switch (category) {
      case 'route':
        if (!this.performance.routeLoadTimes[name]) {
          this.performance.routeLoadTimes[name] = [];
        }
        this.performance.routeLoadTimes[name].push(duration);
        break;
      case 'api':
        if (!this.performance.apiResponseTimes[name]) {
          this.performance.apiResponseTimes[name] = [];
        }
        this.performance.apiResponseTimes[name].push(duration);
        break;
      case 'map':
        this.performance.mapRenderTimes.push(duration);
        break;
      case 'search':
        this.performance.searchResponseTimes.push(duration);
        break;
    }
    
    // Nettoyage
    delete this.markTimers[name];
    
    // Sauvegarder les données
    this.savePerformanceData();
    
    return duration;
  }

  /**
   * Suivi d'un événement
   */
  trackEvent(eventName: string): void {
    if (!this.performance.eventCounts[eventName]) {
      this.performance.eventCounts[eventName] = 0;
    }
    
    this.performance.eventCounts[eventName]++;
    this.savePerformanceData();
  }

  /**
   * Enregistrement d'une erreur
   */
  trackError(context: string, message: string): void {
    this.performance.errors.push({
      time: Date.now(),
      context,
      message
    });
    
    this.savePerformanceData();
  }

  /**
   * Obtention des statistiques de performance
   */
  getPerformanceStats(): AppPerformance {
    return {...this.performance};
  }

  /**
   * Réinitialisation des données de performance
   */
  resetPerformanceData(): void {
    this.performance = this.getInitialPerformance();
    this.savePerformanceData();
  }

  /**
   * Vérifie si l'application est en mode hors ligne
   */
  isInOfflineMode(): boolean {
    return this.isOffline;
  }

  /**
   * Récupère les statistiques du cache
   */
  getCacheStats() {
    return {
      size: cacheManager.size(),
      hitRate: cacheManager.hitRate()
    };
  }
}

// Exporter l'instance singleton
export const appPerformance = new AppPerformanceTracker();
