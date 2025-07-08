'use client';

import { useEffect } from 'react';

declare global {
  interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
  }
}

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const metrics: PerformanceMetrics = {};

    // Observe Core Web Vitals
    const observeWebVitals = () => {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as PerformanceEntry[];
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        metrics.lcp = lastEntry.startTime;

        if (metrics.lcp > 2500) {
          console.warn('🐌 Poor LCP detected:', `${metrics.lcp}ms`);
        }
      });

      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {
        // LCP not supported
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as PerformanceEventTiming[];
        entries.forEach((entry) => {
          metrics.fid = entry.processingStart - entry.startTime;

          if (metrics.fid > 100) {
            console.warn('🐌 Poor FID detected:', `${metrics.fid}ms`);
          }
        });
      });

      try {
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch {
        // FID not supported
      }

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        const entries = entryList.getEntries() as LayoutShift[];

        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        metrics.cls = clsValue;

        if (metrics.cls > 0.1) {
          console.warn('🐌 Poor CLS detected:', metrics.cls);
        }
      });

      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch {
        // CLS not supported
      }
    };

    // Monitor resource loading times
    const observeResourceTiming = () => {
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as PerformanceResourceTiming[];

        entries.forEach((entry) => {
          if (entry.duration > 3000) {
            console.warn('🐌 Slow resource detected:', entry.name, `${entry.duration}ms`);
          }

          if (entry.transferSize > 1024 * 1024) {
            console.warn(
              '📦 Large resource detected:',
              entry.name,
              `${(entry.transferSize / 1024 / 1024).toFixed(2)}MB`
            );
          }
        });
      });

      try {
        resourceObserver.observe({ type: 'resource', buffered: true });
      } catch {
        // Resource timing not supported
      }
    };

    observeWebVitals();
    observeResourceTiming();

    // Report metrics after page load
    const handleLoad = () => {
      setTimeout(() => {
        const navEntries = performance.getEntriesByType('navigation');
        const navEntry = navEntries[0] as PerformanceNavigationTiming | undefined;

        if (navEntry) {
          metrics.ttfb = navEntry.responseStart - navEntry.requestStart;

          console.log('📊 Performance Metrics:', {
            TTFB: `${metrics.ttfb}ms`,
            LCP: `${metrics.lcp}ms`,
            FID: `${metrics.fid}ms`,
            CLS: metrics.cls,
          });
        }
      }, 1000);
    };

    window.addEventListener('load', handleLoad, { once: true });

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);
}
