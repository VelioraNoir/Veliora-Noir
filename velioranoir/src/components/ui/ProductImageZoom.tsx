// src/components/ui/ProductImageZoom.tsx - NEW FILE
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageZoomProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ProductImageZoom({ 
  src, 
  alt, 
  width = 600, 
  height = 600, 
  className = "" 
}: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
  };

  return (
    <>
      {/* Main Image */}
      <div 
        className={`relative cursor-zoom-in group ${className}`}
        onClick={handleClick}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Zoom Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10">
          <div className="bg-white/90 rounded-full p-2">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Click to zoom text */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Click to zoom
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={handleClose}>
          <div className="relative max-w-4xl max-h-4xl w-full h-full flex items-center justify-center p-8">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-8 right-8 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Zoomed Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={1200}
                className="max-w-full max-h-full object-contain"
                quality={100}
                sizes="100vw"
              />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}