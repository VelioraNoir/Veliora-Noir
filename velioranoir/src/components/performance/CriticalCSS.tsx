// src/components/performance/CriticalCSS.tsx - NEW FILE
'use client';

import { useEffect } from 'react';

export default function CriticalCSS() {
  useEffect(() => {
    // Inline critical CSS for above-the-fold content
    const criticalStyles = `
      /* Critical styles for immediate rendering */
      .product-card {
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        will-change: transform;
      }
      
      .glass-card {
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .btn-primary, .btn-secondary {
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      /* Prevent layout shift */
      .product-card-image {
        aspect-ratio: 1;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      }
      
      /* Optimize font loading */
      .font-playfair {
        font-display: swap;
      }
      
      /* Mobile optimizations */
      @media (max-width: 768px) {
        .product-card {
          margin-bottom: 1rem;
        }
        
        .btn-primary, .btn-secondary {
          min-height: 48px;
          font-size: 16px; /* Prevent zoom on iOS */
        }
      }
    `;

    // Add critical CSS to head
    const styleElement = document.createElement('style');
    styleElement.textContent = criticalStyles;
    document.head.appendChild(styleElement);

    return () => {
      // Cleanup
      document.head.removeChild(styleElement);
    };
  }, []);

  return null;
}

