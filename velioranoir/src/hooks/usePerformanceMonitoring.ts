// src/hooks/usePerformanceMonitoring.ts - FIXED VERSION
'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const metrics: Partial<PerformanceMetrics> = {};

    // Observe Core Web Vitals
    const observeWebVitals = () => {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.lcp = lastEntry.startTime;
        
        // Report if LCP is poor (>2.5s)
        if (metrics.lcp && metrics.lcp > 2500) {
          console.warn('🐌 Poor LCP detected:', metrics.lcp + 'ms');
        }
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Fallback for browsers that don't support LCP
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.fid = entry.processingStart - entry.startTime;
          
          // Report if FID is poor (>100ms)
          if (metrics.fid && metrics.fid > 100) {
            console.warn('🐌 Poor FID detected:', metrics.fid + 'ms');
          }
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Fallback for browsers that don't support FID
      }

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        metrics.cls = clsValue;
        
        // Report if CLS is poor (>0.1)
        if (metrics.cls && metrics.cls > 0.1) {
          console.warn('🐌 Poor CLS detected:', metrics.cls);
        }
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Fallback for browsers that don't support CLS
      }
    };

    // Monitor resource loading times
    const observeResourceTiming = () => {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          // Flag slow resources (>3s)
          if (entry.duration > 3000) {
            console.warn('🐌 Slow resource detected:', entry.name, entry.duration + 'ms');
          }
          
          // Flag large resources (>1MB)
          if (entry.transferSize > 1024 * 1024) {
            console.warn('📦 Large resource detected:', entry.name, (entry.transferSize / 1024 / 1024).toFixed(2) + 'MB');
          }
        });
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        // Fallback
      }
    };

    // Start monitoring
    observeWebVitals();
    observeResourceTiming();

    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        if (navigation) {
          metrics.ttfb = navigation.responseStart - navigation.requestStart;
          
          // Log performance summary
          console.log('📊 Performance Metrics:', {
            'TTFB': (metrics.ttfb || 0) + 'ms',
            'LCP': (metrics.lcp || 0) + 'ms',
            'FID': (metrics.fid || 0) + 'ms',
            'CLS': metrics.cls || 0
          });
        }
      }, 1000);
    });

    // Cleanup
    return () => {
      // Performance observers are automatically cleaned up
    };
  }, []);
}