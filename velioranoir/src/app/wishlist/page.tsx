// src/app/wishlist/page.tsx - NEW FILE
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { analytics } from '../../lib/analytics';
import type { Product } from '../../lib/shopify'; 

export default function WishlistPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
    
    // Track wishlist page view
    analytics.pageView('Wishlist', 'user_account');
    analytics.trackEvent('wishlist_page_view', {
      items_count: items.length,
      user_engagement: 'high'
    });
  }, [items.length]);

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
  };

  const handleAddToCart = (product: Product, productId: string) => {
    const mainVariant = product.variants[0];
    if (mainVariant?.available) {
      addToCart(product, mainVariant.id);
      
      // Track wishlist to cart conversion
      analytics.trackEvent('wishlist_to_cart', {
        product_id: productId,
        product_name: product.title,
        price: mainVariant.price,
        conversion_source: 'wishlist_page'
      });
    }
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <main className="relative bg-white min-h-screen pt-28">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-white min-h-screen pt-28">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-playfair font-bold tracking-tight text-black mb-4">
            Your Wishlist
          </h1>
          <p className="text-gray-600">
            {items.length === 0 
              ? "Save your favorite pieces to easily find them later" 
              : `${items.length} piece${items.length !== 1 ? 's' : ''} saved for later`
            }
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Wishlist */
          <div className="text-center py-16">
            <div className="glass-card p-12 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-playfair font-semibold text-black mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Discover beautiful pieces and save your favorites for later.
              </p>
              <Link 
                href="/collections" 
                className="btn-primary"
                onClick={() => {
                  analytics.trackEvent('empty_wishlist_browse_click', {
                    source: 'wishlist_page'
                  });
                }}
              >
                Browse Collections
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Wishlist Actions */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleClearWishlist}
                  className="text-gray-500 hover:text-red-600 transition-colors text-sm"
                >
                  Clear All ({items.length})
                </button>
              </div>
              <Link 
                href="/collections" 
                className="btn-secondary"
                onClick={() => {
                  analytics.trackEvent('wishlist_continue_shopping', {
                    items_in_wishlist: items.length
                  });
                }}
              >
                Continue Shopping
              </Link>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((item) => {
                const product = item.product;
                const mainVariant = product.variants[0];
                const mainImage = product.images[0];

                return (
                  <div key={item.id} className="product-card rounded-2xl overflow-hidden group h-full flex flex-col">
                    <Link 
                      href={`/products/${encodeURIComponent(product.id)}`}
                      className="block"
                      onClick={() => {
                        analytics.trackEvent('wishlist_product_click', {
                          product_id: product.id,
                          product_name: product.title,
                          source: 'wishlist_page'
                        });
                      }}
                    >
                      <div className="product-card-image aspect-square relative">
                        <Image
                          src={mainImage?.src || '/placeholder-product.jpg'}
                          alt={mainImage?.altText || product.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        
                        {/* Remove from wishlist button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveFromWishlist(product.id);
                          }}
                          className="absolute top-4 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                          title="Remove from wishlist"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>

                        {/* Availability badge */}
                        {!mainVariant?.available && (
                          <div className="absolute top-4 left-4 bg-red-600/80 text-white px-3 py-1 rounded-full text-sm">
                            Sold Out
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    {/* Product Info */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-black mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        
                        {product.productType && (
                          <p className="text-sm text-gray-500 mb-3">
                            {product.productType}
                          </p>
                        )}
                        
                        <p className="text-2xl font-semibold text-black mb-4">
                          ${mainVariant?.price}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="space-y-3">
                        <button 
                          onClick={() => handleAddToCart(product, product.id)}
                          disabled={!mainVariant?.available}
                          className={`w-full py-3 rounded-full font-medium transition-all duration-200 ${
                            !mainVariant?.available
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}
                        >
                          {!mainVariant?.available ? 'Sold Out' : 'Add to Cart'}
                        </button>
                        
                        <button 
                          onClick={() => handleRemoveFromWishlist(product.id)}
                          className="w-full py-2 text-gray-500 hover:text-red-600 transition-colors text-sm"
                        >
                          Remove from Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Wishlist Footer */}
            <div className="mt-16 text-center">
              <div className="glass-card p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-playfair font-semibold text-black mb-4">
                  Share Your Wishlist
                </h3>
                <p className="text-gray-600 mb-6">
                  Share your favorite pieces with friends or keep them for special occasions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <button 
                    onClick={() => {
                      if ('share' in navigator && navigator.share) {
                        navigator.share({
                          title: 'My Veliora Noir Wishlist',
                          text: 'Check out my favorite luxury jewelry pieces',
                          url: window.location.href
                        });
                      } else if ('clipboard' in navigator && navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Wishlist link copied to clipboard!');
                      } else {
                        // Fallback for browsers that support neither
                        const textArea = document.createElement('textarea');
                        textArea.value = window.location.href;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        alert('Wishlist link copied to clipboard!');
                      }
                      
                      analytics.trackEvent('wishlist_share', {
                        items_count: items.length,
                        share_method: 'share' in navigator ? 'native_share' : 'copy_link'
                      });
                    }}
                    className="btn-secondary"
                  >
                    Share Wishlist
                  </button>
                  <Link 
                    href="/collections" 
                    className="btn-primary"
                  >
                    Add More Items
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}