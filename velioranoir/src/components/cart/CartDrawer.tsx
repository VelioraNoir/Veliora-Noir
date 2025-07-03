// src/components/cart/CartDrawer.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';

const CartDrawer = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { 
    items, 
    isOpen, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    toggleCart, 
    getTotalPrice, 
    getTotalItems 
  } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted on client
  if (!isMounted) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={toggleCart}
      />
      
      {/* Cart Drawer */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-medium text-gray-900">
            Shopping Cart ({getTotalItems()})
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={toggleCart}
                className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const variant = item.product.variants.find(v => v.id === item.variantId);
                const price = variant ? parseFloat(variant.price) : 0;
                const mainImage = item.product.images[0];

                return (
                  <div key={item.id} className="glass-card p-4 rounded-xl">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                        <p className="text-sm text-gray-500">{item.selectedMaterial}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold">${price.toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 text-sm mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total:</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <button className="w-full bg-gray-900 text-white py-3 rounded-full mb-2">
              Checkout
            </button>
            <button 
              onClick={clearCart}
              className="w-full border border-gray-300 py-3 rounded-full"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;