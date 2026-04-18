/**
 * LLM Response Caching Layer
 * Implements in-memory caching with TTL and automatic cleanup
 * Reduces LLM API calls and improves response times dramatically
 */

interface CacheEntry {
  value: any;
  expiresAt: number;
  createdAt: number;
  hits: number;
}

interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  avgHitTime: number;
}

class LLMCache {
  private cache: Map<string, CacheEntry> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    totalTime: 0,
  };

  /**
   * Generate cache key from prompt and parameters
   */
  private generateKey(prompt: string, params?: Record<string, any>): string {
    const paramsStr = params ? JSON.stringify(params) : "";
    const combined = `${prompt}:${paramsStr}`;
    // Simple hash function for cache key
    return Buffer.from(combined).toString("base64").substring(0, 64);
  }

  /**
   * Get value from cache
   */
  get(prompt: string, params?: Record<string, any>): any | null {
    const key = this.generateKey(prompt, params);
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update stats
    entry.hits++;
    this.stats.hits++;
    const responseTime = Date.now() - entry.createdAt;
    this.stats.totalTime += responseTime;

    return entry.value;
  }

  /**
   * Set value in cache with TTL
   */
  set(prompt: string, value: any, ttlMs: number = 24 * 60 * 60 * 1000, params?: Record<string, any>): void {
    const key = this.generateKey(prompt, params);

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
      createdAt: Date.now(),
      hits: 0,
    });
  }

  /**
   * Clear specific cache entry
   */
  delete(prompt: string, params?: Record<string, any>): boolean {
    const key = this.generateKey(prompt, params);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, totalTime: 0 };
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    const avgHitTime = this.stats.hits > 0 ? this.stats.totalTime / this.stats.hits : 0;

    return {
      totalEntries: this.cache.size,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      hitRate,
      avgHitTime,
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Get cache size in bytes (approximate)
   */
  getSize(): number {
    let size = 0;
    for (const entry of Array.from(this.cache.values())) {
      size += JSON.stringify(entry.value).length;
    }
    return size;
  }

  /**
   * Get most frequently accessed entries
   */
  getTopEntries(limit: number = 10): Array<{ key: string; hits: number; size: number }> {
    const entries: Array<{ key: string; hits: number; size: number }> = [];

    for (const [key, entry] of Array.from(this.cache.entries())) {
      entries.push({
        key,
        hits: entry.hits,
        size: JSON.stringify(entry.value).length,
      });
    }

    return entries.sort((a, b) => b.hits - a.hits).slice(0, limit);
  }
}

// Global cache instance
export const llmCache = new LLMCache();

/**
 * Wrapper function for LLM calls with automatic caching
 */
export async function cachedLLMCall(
  prompt: string,
  llmFunction: () => Promise<any>,
  ttlMs: number = 24 * 60 * 60 * 1000,
  params?: Record<string, any>
): Promise<any> {
  // Check cache first
  const cached = llmCache.get(prompt, params);
  if (cached) {
    console.log("[LLMCache] Cache hit for prompt");
    return cached;
  }

  // Call LLM
  console.log("[LLMCache] Cache miss, calling LLM");
  const result = await llmFunction();

  // Cache result
  llmCache.set(prompt, result, ttlMs, params);

  return result;
}

/**
 * Start periodic cleanup of expired cache entries
 */
export function startCacheCleanup(intervalMs: number = 60000): NodeJS.Timer {
  return setInterval(() => {
    const removed = llmCache.cleanup();
    if (removed > 0) {
      console.log(`[LLMCache] Cleaned up ${removed} expired entries`);
    }
  }, intervalMs);
}

/**
 * Get cache health information
 */
export function getCacheHealth() {
  const stats = llmCache.getStats();
  const size = llmCache.getSize();
  const topEntries = llmCache.getTopEntries(5);

  return {
    stats,
    sizeBytes: size,
    sizeMB: (size / 1024 / 1024).toFixed(2),
    topEntries,
  };
}
