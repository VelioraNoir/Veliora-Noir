// src/components/MobileOptimizations.tsx
'use client';

import { useEffect } from 'react';

export default function MobileOptimizations() {
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const isTouch = 'ontouchstart' in window;

    if (isMobile || isTouch) {
      document.body.classList.add('mobile-device');

      // Prevent 300ms click delay on iOS & enable smooth scrolling
      const scrollableElements = document.querySelectorAll<HTMLElement>(
        '.overflow-y-auto, .overflow-x-auto'
      );
      scrollableElements.forEach(el => {
        el.classList.add('scroll-smooth');
        el.style.webkitOverflowScrolling = 'touch';
      });

      // Optimize images for mobile
      document.querySelectorAll<HTMLImageElement>('img').forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
      });

      // Inject mobile-specific CSS
      const mobileStyles = `
        @media (max-width: 768px) {
          button, a, input, select, textarea {
            min-height: 44px;
            min-width: 44px;
          }
          input, select, textarea { font-size: 16px !important; }
          .product-card { transition: transform 0.2s ease; }
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
          .glass-card {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
        }
      `;
      const styleEl = document.createElement('style');
      styleEl.textContent = mobileStyles;
      document.head.appendChild(styleEl);
    }

    // Viewport-based toggles
    const updateViewport = () => {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      if (vw < 768) {
        document.body.classList.add('mobile-viewport');
        document
          .querySelectorAll<HTMLElement>('.hover\\:scale-105, .hover\\:bg-gray-200')
          .forEach(el => el.classList.add('mobile-no-hover'));
      } else {
        document.body.classList.remove('mobile-viewport');
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  return null;
}
