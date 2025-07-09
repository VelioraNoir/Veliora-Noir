// src/components/cart/CartDrawer.tsx - UPDATED TO USE API ONLY
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore, CartItem } from '../../store/cartStore';
import { analytics } from '../../lib/analytics';

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
    getTotalItems,
  } = useCartStore();

  // mark mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // remove an item
  const handleRemoveItem = (itemId: string, product: CartItem['product']) => {
    removeItem(itemId);
    analytics.trackEvent('remove_from_cart', {
      item_id: product.id,
      item_name: product.title,
      value: parseFloat(product.variants[0]?.price ?? '0'),
      currency: 'USD',
    });
  };

  // change quantity
  const handleUpdateQuantity = (
    itemId: string,
    newQuantity: number,
    product: CartItem['product']
  ) => {
    const oldQuantity = items.find((i) => i.id === itemId)?.quantity ?? 0;
    updateQuantity(itemId, newQuantity);

    if (newQuantity > oldQuantity) {
      analytics.trackEvent('cart_quantity_increase', {
        item_id: product.id,
        item_name: product.title,
        old_quantity: oldQuantity,
        new_quantity: newQuantity,
        engagement_level: 'high',
      });
    } else if (newQuantity < oldQuantity) {
      analytics.trackEvent('cart_quantity_decrease', {
        item_id: product.id,
        item_name: product.title,
        old_quantity: oldQuantity,
        new_quantity: newQuantity,
      });
    }
  };

  // clear the cart
  const handleClearCart = () => {
    analytics.trackEvent('cart_clear', {
      items_count: items.length,
      cart_value: getTotalPrice(),
      user_action: 'clear_all',
    });
    clearCart();
  };

  // FIXED: checkout flow using API endpoint ONLY
  const handleCheckout = async () => {
    if (items.length === 0) return;

    const checkoutItems = items.map((item) => {
      const variant = item.product.variants.find((v) => v.id === item.variantId)!;
      return {
        id: item.product.id,
        name: item.product.title,
        category: item.product.productType ?? 'Jewelry',
        quantity: item.quantity,
        price: parseFloat(variant.price),
      };
    });
    const totalValue = getTotalPrice();

    // Track checkout initiation
    analytics.initiateCheckout(checkoutItems, totalValue);
    
    if (totalValue > 500) {
      analytics.trackEvent('luxury_cart_checkout', {
        cart_value: totalValue,
        items_count: items.length,
        customer_segment: 'high_value',
        average_item_value: totalValue / items.length,
      });
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Convert cart items to API format
      const lineItems = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      console.log('🛒 CartDrawer: Starting checkout with API endpoint');

      // Call our API endpoint (NOT createCheckout directly)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems })
      });

      const data = await response.json();
      
      // DEBUG: Log the API response
      console.log('🔍 API Response:', data);
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Checkout URL from API:', data.checkoutUrl);

      if (response.ok && data.checkoutUrl) {
        console.log('✅ CartDrawer: Redirecting to checkout:', data.checkoutUrl);
        
        analytics.trackEvent('checkout_success', {
          checkout_id: data.checkoutId,
          items_count: items.length,
          cart_value: totalValue,
          redirect_method: 'api_endpoint',
        });

        // Clear cart and redirect
        clearCart();
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Checkout failed. Please try again.';
      setCheckoutError(message);
      setIsCheckingOut(false);
      
      analytics.trackEvent('checkout_error', {
        error_message: message,
        items_count: items.length,
        cart_value: getTotalPrice(),
        checkout_method: 'api_endpoint',
      });
    }
  };

  // toggle drawer
  const handleToggleCart = () => {
    const wasOpen = isOpen;
    toggleCart();

    if (!wasOpen) {
      analytics.trackEvent('cart_open', {
        items_count: items.length,
        cart_value: getTotalPrice(),
        trigger: 'cart_icon_click',
      });
    } else {
      analytics.trackEvent('cart_close', {
        items_count: items.length,
        cart_value: getTotalPrice(),
        time_spent: 'unknown',
      });
    }
  };

  // cart abandonment
  useEffect(() => {
    if (!isOpen && items.length > 0) {
      const timer = setTimeout(() => {
        analytics.trackEvent('cart_abandonment', {
          items_count: items.length,
          cart_value: getTotalPrice(),
          abandonment_stage: 'cart_view',
        });
      }, 5_000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, items.length, getTotalPrice]);

  if (!isMounted) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? 'visible' : 'invisible'
      }`}
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleToggleCart}
      />

      {/* drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-medium text-gray-900">
            Shopping Cart ({getTotalItems()})
          </h2>
          <button
            onClick={handleToggleCart}
            className="p-2 rounded-full hover:bg-gray-100"
            data-luxury-action="cart_close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* cart items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={handleToggleCart}
                className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800"
                data-luxury-action="continue_shopping"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const variant = item.product.variants.find((v) => v.id === item.variantId)!;
                const price = parseFloat(variant.price);
                const mainImage = item.product.images[0];

                return (
                  <div key={item.id} className="bg-white border border-gray-200 p-4 rounded-xl">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {mainImage ? (
                          <Image
                            src={mainImage.src}
                            alt={item.product.title}
                            width={64}
                            height={64}
                            className="object-cover"
                            onClick={() =>
                              analytics.trackEvent('cart_item_image_click', {
                                product_id: item.product.id,
                                product_name: item.product.title,
                              })
                            }
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
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1, item.product)
                              }
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-900"
                              data-luxury-action="cart_quantity_decrease"
                            >
                              –
                            </button>
                            <span className="text-gray-900 font-medium">{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1, item.product)
                              }
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-gray-900"
                              data-luxury-action="cart_quantity_increase"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.product)}
                          className="text-red-500 text-sm mt-2 hover:text-red-700"
                          data-luxury-action="cart_remove_item"
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

        {/* footer with totals & actions */}
        {items.length > 0 && (
          <div className="border-t p-6">
            {checkoutError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{checkoutError}</p>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold mb-4 text-gray-900">
              <span>Total:</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full py-3 rounded-full mb-2 font-medium transition-all duration-200 ${
                isCheckingOut
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
              data-luxury-action="secure_checkout"
            >
              {isCheckingOut ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Secure Checkout'
              )}
            </button>
            <button
              onClick={handleClearCart}
              className="w-full border border-gray-300 py-3 rounded-full hover:bg-gray-50 text-gray-900"
              disabled={isCheckingOut}
              data-luxury-action="clear_cart"
            >
              Clear Cart
            </button>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Secure SSL Checkout</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>30-Day Returns</span>
                <span>•</span>
                <span>Free Shipping</span>
                <span>•</span>
                <span>Luxury Packaging</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;