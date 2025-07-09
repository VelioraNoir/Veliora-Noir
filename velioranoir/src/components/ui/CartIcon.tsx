// src/components/ui/CartIcon.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';

export default function CartIcon() {
  const [isMounted, setIsMounted] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  
  // Only get item count after component is mounted
  const itemCount = isMounted ? getTotalItems() : 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <button
      onClick={toggleCart}
      className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-40"
      aria-label="Open shopping cart"
    >
      <div className="relative">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
        </svg>
        {/* Only show badge after component is mounted and has items */}
        {isMounted && itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </div>
    </button>
  );
}