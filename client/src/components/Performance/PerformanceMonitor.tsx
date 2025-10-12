import React, { useEffect, useState } from 'react';
import { useAnalytics } from './Analytics';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  pageLoadTime: number | null;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  onMetricsUpdate 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    pageLoadTime: null,
  });
  const { trackPerformance } = useAnalytics();

  useEffect(() => {
    // Measure page load time
    const measurePageLoadTime = () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setMetrics(prev => ({ ...prev, pageLoadTime: loadTime }));
        trackPerformance('page_load_time', loadTime);
      }
    };

    // Measure TTFB (Time to First Byte)
    const measureTTFB = () => {
      if (performance.timing) {
        const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
        setMetrics(prev => ({ ...prev, ttfb }));
        trackPerformance('ttfb', ttfb);
      }
    };

    // Core Web Vitals measurement
    const measureCoreWebVitals = () => {
      // First Contentful Paint (FCP)
      if ('PerformanceObserver' in window) {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
            trackPerformance('fcp', fcpEntry.startTime);
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
            trackPerformance('lcp', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              const fid = entry.processingStart - entry.startTime;
            setMetrics(prev => ({ ...prev, fid }));
              trackPerformance('fid', fid);
          }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          setMetrics(prev => ({ ...prev, cls: clsValue }));
          trackPerformance('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }
    };

    // Error tracking
    const trackErrors = () => {
      window.addEventListener('error', (event) => {
        trackPerformance('javascript_error', 1);
        console.error('JavaScript Error:', event.error);
      });

      window.addEventListener('unhandledrejection', (event) => {
        trackPerformance('unhandled_promise_rejection', 1);
        console.error('Unhandled Promise Rejection:', event.reason);
      });
    };

    // Initialize measurements
    measurePageLoadTime();
    measureTTFB();
    measureCoreWebVitals();
    trackErrors();

    // Update parent component with metrics
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }

    // Cleanup
    return () => {
      // Cleanup observers if needed
    };
  }, [trackPerformance, onMetricsUpdate, metrics]);

  // Performance score calculation
  const getPerformanceScore = (): number => {
    let score = 100;
    
    // FCP scoring (good: <1.8s, needs improvement: 1.8-3.0s, poor: >3.0s)
    if (metrics.fcp && metrics.fcp > 1800) {
      score -= metrics.fcp > 3000 ? 20 : 10;
    }
    
    // LCP scoring (good: <2.5s, needs improvement: 2.5-4.0s, poor: >4.0s)
    if (metrics.lcp && metrics.lcp > 2500) {
      score -= metrics.lcp > 4000 ? 20 : 10;
    }
    
    // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
    if (metrics.fid && metrics.fid > 100) {
      score -= metrics.fid > 300 ? 20 : 10;
    }
    
    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (metrics.cls && metrics.cls > 0.1) {
      score -= metrics.cls > 0.25 ? 20 : 10;
    }
    
    return Math.max(0, score);
  };

  return (
    <div className="performance-monitor">
      {/* This component is primarily for monitoring and doesn't render UI */}
      {/* Metrics are tracked and sent to analytics */}
    </div>
  );
};

// Performance utility functions
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  
  console.log(`${name} took ${duration.toFixed(2)}ms`);
  return duration;
};

export const measureAsyncPerformance = async (name: string, fn: () => Promise<any>) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;
  
  console.log(`${name} took ${duration.toFixed(2)}ms`);
  return { result, duration };
};