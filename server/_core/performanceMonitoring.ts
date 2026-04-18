/**
 * Performance Monitoring Middleware
 * Tracks request/response times, cache hits, and system metrics
 */

interface RequestMetrics {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: number;
  cacheHit?: boolean;
  errorMessage?: string;
}

interface SystemMetrics {
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  totalRequests: number;
  totalErrors: number;
  averageResponseTime: number;
  cacheHitRate: number;
}

class PerformanceMonitor {
  private metrics: RequestMetrics[] = [];
  private readonly maxMetrics = 1000;
  private startTime = Date.now();
  private totalCacheHits = 0;
  private totalRequests = 0;
  private totalErrors = 0;

  /**
   * Record a request metric
   */
  recordRequest(metric: RequestMetrics): void {
    this.metrics.push(metric);
    this.totalRequests++;

    if (metric.statusCode >= 400) {
      this.totalErrors++;
    }

    if (metric.cacheHit) {
      this.totalCacheHits++;
    }

    // Keep only recent metrics to avoid memory bloat
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Get system metrics
   */
  getSystemMetrics(): SystemMetrics {
    const uptime = Date.now() - this.startTime;
    const memoryUsage = process.memoryUsage();
    const averageResponseTime =
      this.metrics.length > 0
        ? this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length
        : 0;
    const cacheHitRate =
      this.totalRequests > 0 ? (this.totalCacheHits / this.totalRequests) * 100 : 0;

    return {
      uptime,
      memoryUsage,
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      averageResponseTime,
      cacheHitRate,
    };
  }

  /**
   * Get metrics for a specific path
   */
  getPathMetrics(path: string): RequestMetrics[] {
    return this.metrics.filter((m) => m.path === path);
  }

  /**
   * Get slowest requests
   */
  getSlowestRequests(limit: number = 10): RequestMetrics[] {
    return [...this.metrics].sort((a, b) => b.duration - a.duration).slice(0, limit);
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 10): RequestMetrics[] {
    return this.metrics
      .filter((m) => m.statusCode >= 400)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get metrics summary
   */
  getSummary() {
    const systemMetrics = this.getSystemMetrics();
    const slowest = this.getSlowestRequests(5);
    const recentErrors = this.getRecentErrors(5);

    return {
      system: systemMetrics,
      slowestRequests: slowest,
      recentErrors,
      totalMetricsRecorded: this.metrics.length,
    };
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics = [];
    this.startTime = Date.now();
    this.totalCacheHits = 0;
    this.totalRequests = 0;
    this.totalErrors = 0;
  }

  /**
   * Get metrics for dashboard
   */
  getDashboardMetrics() {
    const systemMetrics = this.getSystemMetrics();

    // Group by path
    const pathMetrics: Record<string, { count: number; avgTime: number; errors: number }> = {};
    this.metrics.forEach((m) => {
      if (!pathMetrics[m.path]) {
        pathMetrics[m.path] = { count: 0, avgTime: 0, errors: 0 };
      }
      pathMetrics[m.path].count++;
      pathMetrics[m.path].avgTime += m.duration;
      if (m.statusCode >= 400) {
        pathMetrics[m.path].errors++;
      }
    });

    // Calculate averages
    Object.keys(pathMetrics).forEach((path) => {
      pathMetrics[path].avgTime /= pathMetrics[path].count;
    });

    return {
      system: systemMetrics,
      paths: pathMetrics,
      slowestRequests: this.getSlowestRequests(10),
      recentErrors: this.getRecentErrors(10),
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Express middleware for performance monitoring
 */
export function performanceMonitoringMiddleware() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();
    const originalSend = res.send;

    res.send = function (data: any) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      performanceMonitor.recordRequest({
        method: req.method,
        path: req.path,
        statusCode,
        duration,
        timestamp: Date.now(),
        cacheHit: res.getHeader("X-Cache-Hit") === "true",
      });

      // Log slow requests
      if (duration > 1000) {
        console.warn(`[Performance] Slow request: ${req.method} ${req.path} took ${duration}ms`);
      }

      // Log errors
      if (statusCode >= 400) {
        console.error(
          `[Performance] Error: ${req.method} ${req.path} returned ${statusCode}`
        );
      }

      return originalSend.call(this, data);
    };

    next();
  };
}

/**
 * Get performance report
 */
export function getPerformanceReport() {
  const metrics = performanceMonitor.getDashboardMetrics();
  const memoryMB = metrics.system.memoryUsage.heapUsed / 1024 / 1024;
  const uptimeHours = metrics.system.uptime / 1000 / 60 / 60;

  return {
    timestamp: new Date().toISOString(),
    uptime: `${uptimeHours.toFixed(2)} hours`,
    memory: `${memoryMB.toFixed(2)} MB`,
    totalRequests: metrics.system.totalRequests,
    totalErrors: metrics.system.totalErrors,
    errorRate: `${((metrics.system.totalErrors / metrics.system.totalRequests) * 100).toFixed(2)}%`,
    averageResponseTime: `${metrics.system.averageResponseTime.toFixed(0)}ms`,
    cacheHitRate: `${metrics.system.cacheHitRate.toFixed(2)}%`,
    paths: metrics.paths,
    slowestRequests: metrics.slowestRequests.slice(0, 5),
    recentErrors: metrics.recentErrors.slice(0, 5),
  };
}
