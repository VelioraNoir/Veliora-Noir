// src/components/ui/PresaleBanner.tsx - NEWSLETTER SIGNUP BANNER
'use client';

import { useState, useEffect } from 'react';
import { analytics } from '../../lib/analytics';

interface NewsletterBannerProps {
  onClose?: () => void;
  className?: string;
}

export default function NewsletterBanner({ 
  onClose,
  className = "" 
}: NewsletterBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
    
    // Track banner dismissal
    analytics.trackEvent('newsletter_banner_dismissed', {
      banner_type: 'community_discount',
      newsletter_discount_code: 'COMMUNITY30',
      general_discount_code: 'VELIORANOIR20'
    });
  };

  const handleNewsletterClick = () => {
    // Track interest in newsletter signup
    analytics.trackEvent('newsletter_banner_click', {
      banner_type: 'community_discount',
      newsletter_discount_code: 'COMMUNITY30',
      general_discount_code: 'VELIORANOIR20',
      cta_text: 'Subscribe Below'
    });

    // Smooth scroll to newsletter section (assuming it's in footer)
    const newsletterSection = document.querySelector('[data-newsletter-signup]') || 
                             document.querySelector('footer') ||
                             document.querySelector('#newsletter');
    
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isVisible || !isMounted) return null;

  return (
    <div className={`relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white border-b border-gray-800 overflow-hidden ${className}`}>
      {/* Luxury background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-10" />
        <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-10" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Main content - centered */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            <div className="text-center space-y-3 max-w-3xl w-full px-2 sm:px-4">
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full border border-white/20">
                <span className="text-xs font-light tracking-widest text-gray-300 uppercase">
                  Exclusive Offer
                </span>
              </div>

              {/* Main headline */}
              <h3 className="text-lg sm:text-xl font-playfair font-medium tracking-wide leading-tight">
                Subscribe for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100 font-semibold">
                  30% off your first order
                </span>
              </h3>

              {/* Subtext */}
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Join our exclusive newsletter for early access to new collections, 
                luxury styling insights, and your instant 30% discount code
              </p>

              {/* Single focused offer */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100 font-semibold">
                    Exclusive 30% Off Code
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Sign up below to receive your exclusive discount code instantly
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <button 
                  onClick={handleNewsletterClick}
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 text-sm font-medium tracking-wide bg-white text-black hover:bg-gray-100 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span>Subscribe Below</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>

              {/* Fine print */}
              <p className="text-xs text-gray-500 max-w-lg mx-auto">
                Receive your exclusive 30% discount code instantly upon signup. 
                Valid for 30 days. Cannot be combined with other offers.
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-2 hover:bg-white/10 rounded-full transition-colors duration-200 group"
            aria-label="Close newsletter offer"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
      
      {/* Optional: Subtle glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
    </div>
  );
}