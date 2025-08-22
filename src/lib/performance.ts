// Performance monitoring utilities for Cabana

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  navigation: number; // Navigation timing
}

interface PerformanceEntry {
  name: string;
  duration: number;
  startTime: number;
  entryType: string;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
    this.trackNavigationTiming();
  }

  private initializeObservers() {
    // Core Web Vitals Observer
    if ('PerformanceObserver' in window) {
      try {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          this.reportMetric('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // FID Observer
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.reportMetric('fid', this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // CLS Observer
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.cls = clsValue;
              this.reportMetric('cls', clsValue);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);

        // FCP Observer
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
              this.reportMetric('fcp', entry.startTime);
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);

      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }

  private trackNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        if (navigation) {
          this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
          this.metrics.navigation = navigation.loadEventEnd - navigation.navigationStart;
          
          this.reportMetric('ttfb', this.metrics.ttfb);
          this.reportMetric('navigation', this.metrics.navigation);
        }
      }, 0);
    });
  }

  private reportMetric(name: string, value: number) {
    // Send to analytics service (replace with your analytics provider)
    if (process.env.NODE_ENV === 'production') {
      // Example: Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vital', {
          name,
          value: Math.round(value),
          event_category: 'performance',
        });
      }
      
      // Example: Custom analytics endpoint
      this.sendToAnalytics(name, value);
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric - ${name}:`, Math.round(value), 'ms');
    }
  }

  private async sendToAnalytics(name: string, value: number) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric: name,
          value: Math.round(value),
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public trackCustomMetric(name: string, startTime: number) {
    const duration = performance.now() - startTime;
    this.reportMetric(`custom_${name}`, duration);
    return duration;
  }

  public markFeatureUsage(feature: string) {
    performance.mark(`feature_${feature}_used`);
    this.reportMetric(`feature_usage_${feature}`, performance.now());
  }

  public measureComponentRender(componentName: string) {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        this.reportMetric(`component_render_${componentName}`, duration);
        return duration;
      }
    };
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for component performance tracking
export const usePerformanceTracking = (componentName: string) => {
  const trackRender = () => performanceMonitor.measureComponentRender(componentName);
  const trackFeature = (feature: string) => performanceMonitor.markFeatureUsage(feature);
  
  return {
    trackRender,
    trackFeature,
    getMetrics: () => performanceMonitor.getMetrics()
  };
};

// Utility functions
export const markPerformanceStart = (label: string) => {
  performance.mark(`${label}_start`);
  return performance.now();
};

export const markPerformanceEnd = (label: string, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  performance.mark(`${label}_end`);
  performance.measure(label, `${label}_start`, `${label}_end`);
  
  performanceMonitor.trackCustomMetric(label, startTime);
  return duration;
};

// Bundle size monitoring
export const trackBundleSize = () => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    const bundleInfo = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
    
    console.log('📦 Connection Info:', bundleInfo);
  }
};