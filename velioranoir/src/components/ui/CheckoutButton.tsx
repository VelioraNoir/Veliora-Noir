// src/components/ui/CheckoutButton.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { analytics } from '../../lib/analytics';

interface CheckoutButtonProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function CheckoutButton({ 
  className = "btn-primary w-full", 
  disabled = false,
  children 
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert cart items to Shopify format
      const lineItems = items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));

      console.log('🛒 Starting checkout with items:', lineItems);

      // Track checkout initiation
      const checkoutItems = items.map(item => ({
        id: item.product.id,
        name: item.product.title,
        category: item.product.productType || 'Jewelry',
        quantity: item.quantity,
        price: parseFloat(item.product.variants.find(v => v.id === item.variantId)?.price || '0')
      }));

      analytics.initiateCheckout(checkoutItems, getTotalPrice());

      // Call our API to create checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems })
      });

      const data = await response.json();

      if (response.ok && data.checkoutUrl) {
        console.log('✅ Redirecting to checkout:', data.checkoutUrl);
        
        // Clear cart after successful checkout creation
        clearCart();
        
        // Redirect to Shopify checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }

    } catch (error) {
      console.error('❌ Checkout failed:', error);
      
      // Track checkout failure
      analytics.trackEvent('checkout_failed', {
        error_message: error instanceof Error ? error.message : 'Unknown error',
        cart_items: items.length,
        cart_total: getTotalPrice()
      });

      // Show user-friendly error
      alert('There was an issue starting checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || isLoading || items.length === 0}
      className={`${className} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </div>
      ) : (
        children || `Checkout (${getTotalItems()} items)`
      )}
    </button>
  );
}