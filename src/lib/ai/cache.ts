import { CacheItem } from './types'

// Simple in-memory TTL cache
export class MemoryCache<T> {
  private cache = new Map<string, CacheItem<T>>()
  private cleanupInterval: NodeJS.Timeout

  constructor(defaultTtlMs: number = 300000) { // 5 minutes default
    this.defaultTtl = defaultTtlMs
    
    // Cleanup expired items every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  private defaultTtl: number

  set(key: string, data: T, ttlMs?: number): void {
    const ttl = ttlMs || this.defaultTtl
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  // Remove expired items
  private cleanup(): void {
    const now = Date.now()
    let removed = 0

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
        removed++
      }
    }

    if (removed > 0) {
      console.log(`AI Cache: Cleaned up ${removed} expired items`)
    }
  }

  // Get cache statistics
  getStats(): {
    size: number
    totalItems: number
    oldestItem: number | null
    newestItem: number | null
  } {
    const now = Date.now()
    let oldest: number | null = null
    let newest: number | null = null

    for (const item of this.cache.values()) {
      const age = now - item.timestamp
      if (oldest === null || age > oldest) oldest = age
      if (newest === null || age < newest) newest = age
    }

    return {
      size: this.cache.size,
      totalItems: this.cache.size,
      oldestItem: oldest,
      newestItem: newest
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.clear()
  }
}

// Global cache instances
export const htmlCache = new MemoryCache<string>(600000) // 10 minutes for HTML
export const promptCache = new MemoryCache<string>(300000) // 5 minutes for prompts
export const templateCache = new MemoryCache<string>(1800000) // 30 minutes for templates

// Cache key generators
export function createCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.map(p => String(p)).join(':')}`
}

export function createHashKey(data: any): string {
  // Simple hash function for cache keys
  let hash = 0
  const str = JSON.stringify(data)
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}