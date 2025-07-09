// src/components/ui/PresaleBanner.tsx - FIXED MOBILE CENTERING
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PresaleBannerProps {
  startDate?: string;
  discount?: string;
  onClose?: () => void;
  className?: string;
}

export default function PresaleBanner({ 
  startDate = "2024-07-10T20:00:00Z", // FIXED: July 10th, 12pm PST / 9am HST  
  discount = "20%",
  onClose,
  className = "" 
}: PresaleBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Fix hydration mismatch

  useEffect(() => {
    // Fix hydration mismatch by waiting for client mount
    setIsMounted(true);
    
    const checkPresaleStatus = () => {
      const now = new Date().getTime();
      const presaleTime = new Date(startDate).getTime();
      setPresaleStarted(now >= presaleTime);
    };

    checkPresaleStatus();
    const timer = setInterval(checkPresaleStatus, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [startDate]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isVisible || !isMounted) return null;

  return (
    <div className={`relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white border-b border-gray-800 overflow-hidden ${className}`}>
      {/* Subtle luxury background pattern */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-transparent via-white to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* FIXED: Better mobile centering with responsive margins */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            <div className="text-center space-y-2 max-w-2xl w-full px-2 sm:px-4">
              {!presaleStarted ? (
                <>
                  <p className="text-xs sm:text-sm font-light tracking-wide text-gray-300 uppercase">
                    Exclusive Preview
                  </p>
                  <h3 className="text-base sm:text-lg font-playfair font-medium tracking-wide leading-tight">
                    Our inaugural collection launches July 10th
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Be among the first to discover handcrafted luxury • Early access subscribers receive {discount} off
                  </p>
                  <div className="pt-2 sm:pt-3">
                    <Link 
                      href="/collections" 
                      className="inline-flex items-center px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium tracking-wide border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/5 rounded"
                    >
                      Preview Collection
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs sm:text-sm font-light tracking-wide text-gray-300 uppercase">
                    Now Available
                  </p>
                  <h3 className="text-base sm:text-lg font-playfair font-medium tracking-wide leading-tight">
                    Our inaugural collection is here
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Handcrafted luxury accessories • Early supporters enjoy {discount} off
                  </p>
                  <div className="pt-2 sm:pt-3">
                    <Link 
                      href="/collections" 
                      className="inline-flex items-center px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium tracking-wide bg-white text-black hover:bg-gray-100 transition-all duration-300 rounded"
                    >
                      Shop Collection
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* FIXED: More responsive close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-2 hover:bg-white/5 rounded-full transition-colors duration-200 group"
            aria-label="Close"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtle accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
    </div>
  );
}