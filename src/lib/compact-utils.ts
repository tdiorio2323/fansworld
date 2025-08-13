/**
 * Compact utility functions to reduce redundancy across the codebase
 */

import { supabase } from '@/integrations/supabase/client';
import pLimit from 'p-limit';

// Generic type-safe database operations
export const dbOps = {
  async upsert<T>(table: string, data: Partial<T>, match?: string): Promise<T> {
    const query = supabase.from(table).upsert(data as any);
    if (match) query.eq(match.split('=')[0], match.split('=')[1]);
    const { data: result, error } = await query.select().single();
    if (error) throw new Error(`DB operation failed: ${error.message}`);
    return result;
  },

  async fetch<T>(table: string, filters?: Record<string, unknown>): Promise<T[]> {
    let query = supabase.from(table).select('*');
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw new Error(`Fetch failed: ${error.message}`);
    return data || [];
  },

  async remove(table: string, id: string): Promise<void> {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw new Error(`Delete failed: ${error.message}`);
  }
};

// Simplified error handler
export const handleError = (error: unknown, defaultMsg = 'Operation failed'): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return defaultMsg;
};

// Compact date utilities
export const dateUtils = {
  now: () => new Date().toISOString(),
  today: () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  },
  addSeconds: (seconds: number) => new Date(Date.now() + seconds * 1000).toISOString(),
  isAfter: (date: string, compare: Date) => new Date(date) >= compare
};

// Type guards and validators
export const validators = {
  isString: (val: unknown): val is string => typeof val === 'string',
  isNumber: (val: unknown): val is number => typeof val === 'number' && !isNaN(val),
  isArray: <T>(val: unknown): val is T[] => Array.isArray(val),
  notNull: <T>(val: T | null | undefined): val is T => val != null
};

// Compact async utilities with concurrency control
export const asyncUtils = {
  parallel: <T>(promises: Promise<T>[]): Promise<T[]> => Promise.all(promises),
  
  // REPLACED: O(n²) sequential with concurrency-limited processing
  concurrent: async <T, R>(
    items: T[], 
    fn: (item: T) => Promise<R>, 
    concurrency: number = 5
  ): Promise<R[]> => {
    const limit = pLimit(concurrency);
    return Promise.all(items.map(item => limit(() => fn(item))));
  },
  
  // Legacy sequential method for backward compatibility (now uses concurrency=1)
  sequential: async <T, R>(items: T[], fn: (item: T) => Promise<R>): Promise<R[]> => {
    return asyncUtils.concurrent(items, fn, 1);
  },
  
  // Batch processing with concurrency control
  batch: async <T, R>(
    items: T[],
    fn: (batch: T[]) => Promise<R>,
    batchSize: number = 10,
    concurrency: number = 3
  ): Promise<R[]> => {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    const limit = pLimit(concurrency);
    return Promise.all(batches.map(batch => limit(() => fn(batch))));
  },
  
  // Process with retry and exponential backoff
  withRetry: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) break;
        
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
};

// Compact object utilities
export const objUtils = {
  pick: <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => 
    keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {} as Pick<T, K>),
  
  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  },
  
  compact: <T extends Record<string, unknown>>(obj: T): T => 
    Object.entries(obj).reduce((acc, [k, v]) => 
      v !== undefined && v !== null ? { ...acc, [k]: v } : acc, {} as T)
};

// Memoization helper
export const memo = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};