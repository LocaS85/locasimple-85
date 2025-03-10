
type ExpiryPolicy = 'fixed' | 'sliding';

interface CacheItem<T> {
  value: T;
  expiry: number;
  lastAccessed?: number;
}

interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  policy?: ExpiryPolicy;
  maxSize?: number; // Maximum number of items in cache
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
      lastAccessed: now
    });
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }
    
    const now = Date.now();
    
    // Check if item is expired
    if (now > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    
    // Update last accessed time for sliding expiry
    if (item.lastAccessed) {
      item.lastAccessed = now;
    }
    
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
  }

  /**
   * Clear expired items from the cache
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
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
