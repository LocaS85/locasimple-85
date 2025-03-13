
type ExpiryPolicy = 'fixed' | 'sliding';

interface CacheItem<T> {
  value: T;
  expiry: number;
  lastAccessed?: number;
  hits: number;
}

interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  policy?: ExpiryPolicy;
  maxSize?: number; // Maximum number of items in cache
}

interface CacheStats {
  hits: number;
  misses: number;
  items: number;
  oldestItem: number | null;
  newestItem: number | null;
}

/**
 * In-memory cache manager for API responses and frequent data
 */
export class CacheManager {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultOptions: CacheOptions = {
    ttl: 5 * 60 * 1000, // 5 minutes by default
    policy: 'fixed',
    maxSize: 100
  };
  private hits: number = 0;
  private misses: number = 0;
  private persistenceEnabled: boolean = false;

  constructor() {
    this.loadFromStorage();
    this.setupAutoCleanup();
    
    // Sauvegarder le cache avant de quitter la page
    window.addEventListener('beforeunload', () => {
      this.saveToStorage();
    });
  }

  /**
   * Configure le nettoyage automatique du cache toutes les 5 minutes
   */
  private setupAutoCleanup() {
    setInterval(() => {
      this.clearExpired();
    }, 5 * 60 * 1000); // Nettoyage toutes les 5 minutes
  }

  /**
   * Active ou désactive la persistance du cache dans le localStorage
   */
  enablePersistence(enabled: boolean): void {
    this.persistenceEnabled = enabled;
    if (enabled) {
      this.loadFromStorage();
    }
  }

  /**
   * Sauvegarde le cache dans le localStorage
   */
  private saveToStorage(): void {
    if (!this.persistenceEnabled) return;
    
    try {
      const serialized: Record<string, { value: any, expiry: number, hits: number }> = {};
      
      this.cache.forEach((item, key) => {
        // Ne sauvegarder que les éléments qui ne sont pas expirés
        if (item.expiry > Date.now()) {
          serialized[key] = {
            value: item.value,
            expiry: item.expiry,
            hits: item.hits
          };
        }
      });
      
      localStorage.setItem('app_cache', JSON.stringify(serialized));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  }

  /**
   * Charge le cache depuis le localStorage
   */
  private loadFromStorage(): void {
    if (!this.persistenceEnabled) return;
    
    try {
      const serialized = localStorage.getItem('app_cache');
      if (!serialized) return;
      
      const data = JSON.parse(serialized);
      const now = Date.now();
      
      Object.entries(data).forEach(([key, entry]: [string, any]) => {
        // Ne charger que les éléments qui ne sont pas expirés
        if (entry.expiry > now) {
          this.cache.set(key, {
            value: entry.value,
            expiry: entry.expiry,
            lastAccessed: now,
            hits: entry.hits || 0
          });
        }
      });
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
    }
  }

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param value Value to store
   * @param options Cache options
   */
  set<T>(key: string, value: T, options?: Partial<CacheOptions>): void {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    // Clear oldest items if cache exceeds max size
    if (this.cache.size >= (mergedOptions.maxSize || this.defaultOptions.maxSize)) {
      this.clearOldest();
    }
    
    const now = Date.now();
    this.cache.set(key, {
      value,
      expiry: now + mergedOptions.ttl,
      lastAccessed: now,
      hits: 0
    });
    
    // Sauvegarder si la persistance est activée
    if (this.persistenceEnabled) {
      this.saveToStorage();
    }
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      this.misses++;
      return undefined;
    }
    
    const now = Date.now();
    
    // Check if item is expired
    if (now > item.expiry) {
      this.cache.delete(key);
      this.misses++;
      return undefined;
    }
    
    // Update last accessed time for sliding expiry
    item.lastAccessed = now;
    item.hits++;
    this.hits++;
    
    return item.value as T;
  }

  /**
   * Remove a value from the cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    
    // Effacer aussi le cache persistant
    if (this.persistenceEnabled) {
      localStorage.removeItem('app_cache');
    }
  }

  /**
   * Clear expired items from the cache
   */
  clearExpired(): void {
    const now = Date.now();
    let count = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (count > 0) {
      console.log(`Cleared ${count} expired items from cache`);
      
      // Mettre à jour le cache persistant
      if (this.persistenceEnabled) {
        this.saveToStorage();
      }
    }
  }

  /**
   * Clear the oldest items from the cache
   * @param count Number of items to clear
   */
  private clearOldest(count: number = 1): void {
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => (a[1].lastAccessed || 0) - (b[1].lastAccessed || 0));
    
    for (let i = 0; i < Math.min(count, entries.length); i++) {
      this.cache.delete(entries[i][0]);
    }
    
    // Mettre à jour le cache persistant
    if (this.persistenceEnabled && count > 0) {
      this.saveToStorage();
    }
  }

  /**
   * Obtenir le taux de réussite du cache
   * @returns Le pourcentage de hits
   */
  hitRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  }

  /**
   * Obtenir la taille actuelle du cache
   * @returns Le nombre d'éléments dans le cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Obtenir des statistiques sur le cache
   * @returns Les statistiques du cache
   */
  getStats(): CacheStats {
    let oldestTimestamp: number | null = null;
    let newestTimestamp: number | null = null;
    
    this.cache.forEach(item => {
      const timestamp = item.lastAccessed || 0;
      
      if (oldestTimestamp === null || timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp;
      }
      
      if (newestTimestamp === null || timestamp > newestTimestamp) {
        newestTimestamp = timestamp;
      }
    });
    
    return {
      hits: this.hits,
      misses: this.misses,
      items: this.cache.size,
      oldestItem: oldestTimestamp,
      newestItem: newestTimestamp
    };
  }
}

// Export a singleton instance for use throughout the app
export const cacheManager = new CacheManager();

/**
 * Cache the results of an async function
 * @param fn Function to cache
 * @param keyPrefix Prefix for cache key
 * @param options Cache options
 * @returns Function result, either from cache or freshly executed
 */
export const withCache = async <T, A extends any[]>(
  fn: (...args: A) => Promise<T>,
  keyPrefix: string,
  options?: Partial<CacheOptions>
) => {
  return async (...args: A): Promise<T> => {
    const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;
    const cachedResult = cacheManager.get<T>(cacheKey);
    
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    
    const result = await fn(...args);
    cacheManager.set(cacheKey, result, options);
    return result;
  };
};

// Activer la persistance par défaut
cacheManager.enablePersistence(true);
