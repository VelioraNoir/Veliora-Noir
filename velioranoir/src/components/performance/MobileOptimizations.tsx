// src/components/performance/MobileOptimizations.tsx - FIXED VERSION
'use client';

import { useEffect } from 'react';

export default function MobileOptimizations() {
  useEffect(() => {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window;

    if (isMobile || isTouch) {
      document.body.classList.add('mobile-device');
      
      // Mobile-specific optimizations
      const mobileOptimizations = () => {
        // Prevent 300ms click delay on iOS
        document.addEventListener('touchstart', () => {}, { passive: true });
        
        // Improve scroll performance on mobile
        const scrollableElements = document.querySelectorAll('.overflow-y-auto, .overflow-x-auto');
        scrollableElements.forEach(element => {
          element.classList.add('scroll-smooth');
          // Fix TypeScript error - cast to any for webkit property
          (element as any).style.webkitOverflowScrolling = 'touch';
        });
        
        // Optimize images for mobile
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          img.loading = 'lazy';
          img.decoding = 'async';
        });
        
        // Add mobile-specific CSS
        const mobileStyles = `
          /* Mobile-specific optimizations */
          @media (max-width: 768px) {
            /* Improve touch targets */
            button, a, input, select, textarea {
              min-height: 44px;
              min-width: 44px;
            }
            
            /* Prevent zoom on form inputs */
            input, select, textarea {
              font-size: 16px !important;
            }
            
            /* Optimize animations for mobile */
            .product-card {
              transition: transform 0.2s ease;
            }
            
            /* Reduce motion for better performance */
            @media (prefers-reduced-motion: reduce) {
              * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }
            
            /* Improve mobile layout */
            .glass-card {
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
            }
          }
        `;
        
        const mobileStyleElement = document.createElement('style');
        mobileStyleElement.textContent = mobileStyles;
        document.head.appendChild(mobileStyleElement);
      };
      
      mobileOptimizations();
    }

    // Add viewport-based optimizations
    const updateViewportOptimizations = () => {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      
      if (vw < 768) {
        // Mobile optimizations
        document.body.classList.add('mobile-viewport');
        
        // Disable hover effects on mobile
        const hoverElements = document.querySelectorAll('.hover\\:scale-105, .hover\\:bg-gray-200');
        hoverElements.forEach(element => {
          element.classList.add('mobile-no-hover');
        });
      } else {
        document.body.classList.remove('mobile-viewport');
      }
    };

    updateViewportOptimizations();
    window.addEventListener('resize', updateViewportOptimizations);

    return () => {
      window.removeEventListener('resize', updateViewportOptimizations);
    };
  }, []);

  return null;
}