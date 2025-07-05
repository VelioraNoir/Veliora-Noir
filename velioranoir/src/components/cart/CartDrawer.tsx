// src/components/cart/CartDrawer.tsx - REPLACE ENTIRE FILE
'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { createCheckout } from '../../lib/shopify';

const CartDrawer = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
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

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Convert cart items to Shopify checkout format
      const lineItems = items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      console.log('🛒 Starting checkout with items:', lineItems);

      // Create checkout with Shopify
      const checkout = await createCheckout(lineItems);
      
      console.log('✅ Checkout created, redirecting to:', checkout.webUrl);

      // Redirect to Shopify checkout
      window.location.href = checkout.webUrl;
      
    } catch (error) {
      console.error('❌ Checkout failed:', error);
      setCheckoutError(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
      setIsCheckingOut(false);
    }
  };

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
                  <div key={item.id} className="bg-white border border-gray-200 p-4 rounded-xl">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {mainImage ? (
                          <img 
                            src={mainImage.src} 
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                        {item.product.productType && (
                          <p className="text-sm text-gray-500">{item.product.productType}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-gray-900">${price.toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-900"
                            >
                              -
                            </button>
                            <span className="text-gray-900 font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-900"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 text-sm mt-2 hover:text-red-700"
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
            {/* Error Message */}
            {checkoutError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{checkoutError}</p>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold mb-4 text-gray-900">
              <span>Total:</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            
            {/* Main Checkout Button */}
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full py-3 rounded-full mb-2 font-medium transition-all duration-200 ${
                isCheckingOut 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {isCheckingOut ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Secure Checkout'
              )}
            </button>
            
            <button 
              onClick={clearCart}
              className="w-full border border-gray-300 py-3 rounded-full hover:bg-gray-50 text-gray-900"
              disabled={isCheckingOut}
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