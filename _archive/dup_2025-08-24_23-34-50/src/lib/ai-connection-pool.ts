// ENHANCED AI CONNECTION POOLING - Performance & Security Optimization
// TD Studios ecosystem - enterprise-grade AI client management

import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { EventEmitter } from 'events';

interface PoolConfig {
  maxConnections: number;
  idleTimeout: number;
  maxRetries: number;
  retryDelay: number;
  healthCheckInterval: number;
}

interface ConnectionHealth {
  isHealthy: boolean;
  lastCheck: number;
  failures: number;
  totalRequests: number;
  averageResponseTime: number;
}

interface PooledConnection {
  id: string;
  client: Anthropic | OpenAI;
  type: 'claude' | 'openai';
  created: number;
  lastUsed: number;
  isActive: boolean;
  health: ConnectionHealth;
}

class AIConnectionPool extends EventEmitter {
  private claudePool: PooledConnection[] = [];
  private openaiPool: PooledConnection[] = [];
  private config: PoolConfig;
  private stats = {
    totalConnections: 0,
    activeConnections: 0,
    requestsServed: 0,
    failures: 0,
    averageResponseTime: 0
  };

  constructor(config: Partial<PoolConfig> = {}) {
    super();
    
    this.config = {
      maxConnections: config.maxConnections || 5,
      idleTimeout: config.idleTimeout || 5 * 60 * 1000, // 5 minutes
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      healthCheckInterval: config.healthCheckInterval || 30 * 1000 // 30 seconds
    };

    // Initialize health monitoring
    this.startHealthMonitoring();
    
    // Initialize base connections
    this.initializeConnections();
    
    console.log('🔗 AI Connection Pool initialized with', this.config);
  }

  private async initializeConnections(): Promise<void> {
    try {
      // Create initial Claude connections
      for (let i = 0; i < Math.min(2, this.config.maxConnections); i++) {
        await this.createConnection('claude');
      }
      
      // Create initial OpenAI connections
      for (let i = 0; i < Math.min(2, this.config.maxConnections); i++) {
        await this.createConnection('openai');
      }
      
      console.log(`✅ Initialized ${this.claudePool.length} Claude + ${this.openaiPool.length} OpenAI connections`);
    } catch (error) {
      console.error('❌ Failed to initialize connection pools:', error);
    }
  }

  private async createConnection(type: 'claude' | 'openai'): Promise<PooledConnection> {
    const pool = type === 'claude' ? this.claudePool : this.openaiPool;
    
    if (pool.length >= this.config.maxConnections) {
      throw new Error(`${type} connection pool at maximum capacity`);
    }

    let client: Anthropic | OpenAI;
    
    if (type === 'claude') {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not configured');
      }
      client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        maxRetries: this.config.maxRetries,
        timeout: 30000
      });
    } else {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
      }
      client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        maxRetries: this.config.maxRetries,
        timeout: 30000
      });
    }

    const connection: PooledConnection = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      client,
      type,
      created: Date.now(),
      lastUsed: Date.now(),
      isActive: false,
      health: {
        isHealthy: true,
        lastCheck: Date.now(),
        failures: 0,
        totalRequests: 0,
        averageResponseTime: 0
      }
    };

    pool.push(connection);
    this.stats.totalConnections++;
    
    this.emit('connectionCreated', { type, id: connection.id });
    
    return connection;
  }

  private getAvailableConnection(type: 'claude' | 'openai'): PooledConnection | null {
    const pool = type === 'claude' ? this.claudePool : this.openaiPool;
    
    // Find healthy, non-active connection
    const available = pool.find(conn => 
      !conn.isActive && 
      conn.health.isHealthy &&
      Date.now() - conn.lastUsed < this.config.idleTimeout
    );
    
    if (available) {
      available.isActive = true;
      available.lastUsed = Date.now();
      this.stats.activeConnections++;
      return available;
    }
    
    return null;
  }

  private releaseConnection(connection: PooledConnection): void {
    connection.isActive = false;
    connection.lastUsed = Date.now();
    this.stats.activeConnections--;
    
    this.emit('connectionReleased', { type: connection.type, id: connection.id });
  }

  // MAIN API METHODS

  async executeClaudeRequest<T>(
    requestFn: (client: Anthropic) => Promise<T>,
    retryCount: number = 0
  ): Promise<T> {
    let connection = this.getAvailableConnection('claude');
    
    // Create new connection if none available and under limit
    if (!connection && this.claudePool.length < this.config.maxConnections) {
      try {
        connection = await this.createConnection('claude');
      } catch (error) {
        console.warn('Failed to create new Claude connection:', error);
      }
    }
    
    if (!connection) {
      // Wait for connection to become available
      connection = await this.waitForConnection('claude');
    }

    const startTime = Date.now();
    
    try {
      const result = await requestFn(connection.client as Anthropic);
      
      // Update connection health
      const responseTime = Date.now() - startTime;
      this.updateConnectionHealth(connection, responseTime, true);
      
      this.stats.requestsServed++;
      this.stats.averageResponseTime = 
        (this.stats.averageResponseTime + responseTime) / 2;
      
      return result;
      
    } catch (error) {
      this.updateConnectionHealth(connection, Date.now() - startTime, false);
      this.stats.failures++;
      
      console.error(`Claude request failed (attempt ${retryCount + 1}):`, error);
      
      // Retry logic with exponential backoff
      if (retryCount < this.config.maxRetries) {
        await this.delay(this.config.retryDelay * Math.pow(2, retryCount));
        return this.executeClaudeRequest(requestFn, retryCount + 1);
      }
      
      throw error;
      
    } finally {
      if (connection) {
        this.releaseConnection(connection);
      }
    }
  }

  async executeOpenAIRequest<T>(
    requestFn: (client: OpenAI) => Promise<T>,
    retryCount: number = 0
  ): Promise<T> {
    let connection = this.getAvailableConnection('openai');
    
    if (!connection && this.openaiPool.length < this.config.maxConnections) {
      try {
        connection = await this.createConnection('openai');
      } catch (error) {
        console.warn('Failed to create new OpenAI connection:', error);
      }
    }
    
    if (!connection) {
      connection = await this.waitForConnection('openai');
    }

    const startTime = Date.now();
    
    try {
      const result = await requestFn(connection.client as OpenAI);
      
      const responseTime = Date.now() - startTime;
      this.updateConnectionHealth(connection, responseTime, true);
      
      this.stats.requestsServed++;
      this.stats.averageResponseTime = 
        (this.stats.averageResponseTime + responseTime) / 2;
      
      return result;
      
    } catch (error) {
      this.updateConnectionHealth(connection, Date.now() - startTime, false);
      this.stats.failures++;
      
      console.error(`OpenAI request failed (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < this.config.maxRetries) {
        await this.delay(this.config.retryDelay * Math.pow(2, retryCount));
        return this.executeOpenAIRequest(requestFn, retryCount + 1);
      }
      
      throw error;
      
    } finally {
      if (connection) {
        this.releaseConnection(connection);
      }
    }
  }

  // UTILITY METHODS

  private async waitForConnection(type: 'claude' | 'openai', timeout: number = 10000): Promise<PooledConnection> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkInterval = setInterval(() => {
        const connection = this.getAvailableConnection(type);
        
        if (connection) {
          clearInterval(checkInterval);
          resolve(connection);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          reject(new Error(`Timeout waiting for ${type} connection`));
        }
      }, 100);
    });
  }

  private updateConnectionHealth(
    connection: PooledConnection, 
    responseTime: number, 
    success: boolean
  ): void {
    const health = connection.health;
    
    health.totalRequests++;
    health.lastCheck = Date.now();
    health.averageResponseTime = (health.averageResponseTime + responseTime) / 2;
    
    if (success) {
      health.failures = Math.max(0, health.failures - 1);
      health.isHealthy = true;
    } else {
      health.failures++;
      health.isHealthy = health.failures < 3;
    }
  }

  private startHealthMonitoring(): void {
    setInterval(() => {
      this.performHealthCheck();
      this.cleanupIdleConnections();
    }, this.config.healthCheckInterval);
  }

  private performHealthCheck(): void {
    const allConnections = [...this.claudePool, ...this.openaiPool];
    let unhealthyCount = 0;
    
    for (const connection of allConnections) {
      if (!connection.health.isHealthy || 
          Date.now() - connection.health.lastCheck > this.config.healthCheckInterval * 2) {
        unhealthyCount++;
      }
    }
    
    if (unhealthyCount > 0) {
      console.warn(`⚠️ ${unhealthyCount} unhealthy connections detected`);
      this.emit('healthCheck', { unhealthyCount, totalConnections: allConnections.length });
    }
  }

  private cleanupIdleConnections(): void {
    const now = Date.now();
    let cleaned = 0;
    
    // Cleanup Claude connections
    this.claudePool = this.claudePool.filter(conn => {
      const isIdle = !conn.isActive && now - conn.lastUsed > this.config.idleTimeout;
      if (isIdle && this.claudePool.length > 1) { // Keep at least 1 connection
        cleaned++;
        return false;
      }
      return true;
    });
    
    // Cleanup OpenAI connections  
    this.openaiPool = this.openaiPool.filter(conn => {
      const isIdle = !conn.isActive && now - conn.lastUsed > this.config.idleTimeout;
      if (isIdle && this.openaiPool.length > 1) {
        cleaned++;
        return false;
      }
      return true;
    });
    
    if (cleaned > 0) {
      this.stats.totalConnections -= cleaned;
      console.log(`🧹 Cleaned up ${cleaned} idle AI connections`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // PUBLIC API

  getStats() {
    return {
      ...this.stats,
      claudeConnections: this.claudePool.length,
      openaiConnections: this.openaiPool.length,
      activeClaudeConnections: this.claudePool.filter(c => c.isActive).length,
      activeOpenaiConnections: this.openaiPool.filter(c => c.isActive).length,
      healthyConnections: [...this.claudePool, ...this.openaiPool].filter(c => c.health.isHealthy).length
    };
  }

  async shutdown(): Promise<void> {
    console.log('🔌 Shutting down AI connection pool...');
    
    // Wait for active connections to complete
    const maxWait = 10000; // 10 seconds
    const startTime = Date.now();
    
    while (this.stats.activeConnections > 0 && Date.now() - startTime < maxWait) {
      await this.delay(100);
    }
    
    // Clear pools
    this.claudePool.length = 0;
    this.openaiPool.length = 0;
    this.stats.totalConnections = 0;
    this.stats.activeConnections = 0;
    
    this.removeAllListeners();
    
    console.log('✅ AI connection pool shutdown complete');
  }
}

// Singleton instance
export const aiConnectionPool = new AIConnectionPool({
  maxConnections: process.env.NODE_ENV === 'production' ? 10 : 3,
  idleTimeout: 5 * 60 * 1000, // 5 minutes
  maxRetries: 3,
  retryDelay: 1000,
  healthCheckInterval: 30 * 1000
});

export default aiConnectionPool;