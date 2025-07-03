// src/components/3d/Product3DModal.tsx
'use client';

import { Product } from '../../lib/shopify';

interface Product3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function Product3DModal({ isOpen, onClose, product }: Product3DModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium text-gray-900">
            {product.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Placeholder 3D Viewer */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-gray-600">3D View Coming Soon</p>
          </div>
        </div>

        {/* Product Info */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-yellow-600">
            ${product.variants[0]?.price} {product.variants[0]?.currencyCode}
          </p>
        </div>
      </div>
    </div>
  );
}