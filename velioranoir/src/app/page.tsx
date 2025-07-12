// src/app/page.tsx - COMPLETE FILE WITH CUSTOM NEWSLETTER
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllProductsWithFallback, Product } from '../lib/shopify';
import { ProductCardSkeleton, ErrorMessage } from '../components/ui/LoadingComponents';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import PresaleBanner from '../components/ui/PresaleBanner';
import CartDrawer from '../components/cart/CartDrawer';
import CartIcon from '../components/ui/CartIcon';
import { analytics } from '../lib/analytics';

// Custom Newsletter Component for Klaviyo
const CustomNewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      // Call Klaviyo's identify API
      const response = await fetch('/api/klaviyo-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed! Here\'s your exclusive offer:');
        setEmail('');
        setShowCoupon(true); // Show coupon popup
        
        // Track successful subscription
        analytics.trackEvent('newsletter_subscription', {
          source: 'homepage',
          email_domain: email.split('@')[1]
        });
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      console.error('Newsletter subscription error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className="btn-primary whitespace-nowrap"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </form>
      
      {/* Status Messages */}
      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800 text-center">{message}</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-800 text-center">{message}</p>
        </div>
      )}

      {/* Coupon Popup */}
      {showCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center p-2">
                <Image
                  src="/images/logo.png"
                  alt="Veliora Noir Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-2">
                Welcome to Veliora Noir!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for subscribing. Here&apos;s your exclusive 30% off coupon:
              </p>
              
              {/* Coupon Code */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-4 rounded-xl mb-6">
                <p className="text-sm font-medium mb-1">Use code:</p>
                <p className="text-2xl font-bold tracking-wider">WELCOME30</p>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                Valid for 7 days on your first order. Cannot be combined with other offers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/collections" 
                  className="btn-primary flex-1"
                  onClick={() => setShowCoupon(false)}
                >
                  Shop Now
                </Link>
                <button 
                  onClick={() => setShowCoupon(false)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Product Card with Cart Integration and Links - WITH FIXED WISHLIST
const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const mainImage = product.images[0];
  const mainVariant = product.variants[0];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMounted) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        console.log('Removed from wishlist:', product.title);
      } else {
        addToWishlist(product);
        console.log('Added to wishlist:', product.title);
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();
    
    if (mainVariant && isMounted) {
      console.log('Adding to cart:', product.title, mainVariant.available);
      addItem(product, mainVariant.id);
      
      // TRACK ADD TO CART EVENT
      analytics.addToCart(
        product.id,
        product.title,
        mainVariant.price,
        1
      );
      
      // Show luxury feedback
      setShowAddedFeedback(true);
      setTimeout(() => setShowAddedFeedback(false), 3000);
    }
  };

  const handleProductClick = () => {
    // TRACK PRODUCT VIEW
    analytics.productView(
      product.id,
      product.title,
      mainVariant?.price || '0',
      product.productType || 'Jewelry'
    );
  };

  return (
    <Link 
      href={`/products/${encodeURIComponent(product.id)}`}
      onClick={handleProductClick}
      className="block bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl overflow-hidden animate-fade-in-up group h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
      data-luxury-action="product_card_click"
    >
      <div className="product-card-image aspect-square relative">
        <Image
          src={mainImage?.src || '/placeholder-product.jpg'}
          alt={mainImage?.altText || product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={index < 4}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* FIXED Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
            isMounted && isInWishlist(product.id)
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200'
          }`}
          data-luxury-action="wishlist_toggle"
          title={isMounted && isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg className="w-4 h-4" fill={isMounted && isInWishlist(product.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        {/* Quick Add to Cart button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleAddToCart}
            className={`btn-primary text-sm ${!mainVariant?.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!mainVariant?.available}
            data-luxury-action="quick_add_to_cart"
          >
            {mainVariant?.available ? 'Quick Add' : 'Sold Out'}
          </button>
        </div>

        {/* Availability badge */}
        {!mainVariant?.available && (
          <div className="absolute top-4 left-4 bg-red-600/80 text-white px-3 py-1 rounded-full text-sm">
            Sold Out
          </div>
        )}
      </div>
      
      {/* FIXED: Flex layout to push button to bottom */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-black mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          {/* Product type and vendor */}
          {product.productType && (
            <p className="text-sm text-gray-500 mb-3">
              {product.productType} {product.vendor && `• ${product.vendor}`}
            </p>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-semibold text-black">
              ${mainVariant?.price}
            </p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className="w-4 h-4 text-yellow-400" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        
        {/* FIXED: Button always at bottom */}
        <button 
          onClick={handleAddToCart}
          className={`w-full btn-secondary ${!mainVariant?.available ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!mainVariant?.available}
          data-luxury-action="add_to_cart"
        >
          {mainVariant?.available ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>

      {/* Luxury Added to Cart Popup */}
      {showAddedFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 animate-fade-in-up max-w-sm mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-2">
                Added to Cart
              </h3>
              <p className="text-sm text-gray-600 mb-1">{product.title}</p>
              <p className="text-xs text-gray-500">${mainVariant?.price}</p>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};

// Hero Section with Enhanced 3D Showcase
const HeroSection = () => {
  return (
    <section className="relative py-20 px-8 text-center">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="lg:text-left">
            <h1 className="text-6xl font-semibold tracking-tight text-black mb-6 animate-fade-in-up">
              Veliora Noir
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in-up delay-200 leading-relaxed">
              Discover our exquisite collection of handcrafted metallic accessories, 
              where timeless elegance meets contemporary sophistication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center animate-fade-in-up delay-300">
              <Link 
                href="/collections" 
                className="btn-primary"
                data-luxury-action="hero_explore_collections"
                onClick={() => analytics.trackEvent('hero_cta_click', { cta_type: 'explore_collection' })}
              >
                Explore Collection
              </Link>
              <Link 
                href="/about" 
                className="btn-secondary"
                data-luxury-action="hero_our_story"
                onClick={() => analytics.trackEvent('hero_cta_click', { cta_type: 'our_story' })}
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="animate-fade-in-up delay-400">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="/images/hero-jewelry.png" 
                alt="Elegant jewelry collection showcase"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a placeholder if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div class="text-center p-8">
                        <div class="w-16 h-16 mx-auto mb-4 text-gray-400">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                          </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-600 mb-2">Exquisite Craftsmanship</h3>
                        <p class="text-sm text-gray-500">Every piece tells a story of elegance and sophistication</p>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Products Grid Component
const ProductsGrid = ({ products }: { products: Product[] }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">
          No products available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

// Main Page Component
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getAllProductsWithFallback();
        setProducts(fetchedProducts);
        
        // TRACK PAGE VIEW
        analytics.pageView('Homepage', 'main');
        
        // TRACK PRODUCT COLLECTION VIEW
        analytics.viewCategory('Featured Products', fetchedProducts.length);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        
        // TRACK ERROR
        analytics.trackEvent('homepage_load_error', {
          error_message: err instanceof Error ? err.message : 'unknown_error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Track scroll engagement
  useEffect(() => {
    let scrollTracked = false;
    
    const handleScroll = () => {
      if (scrollTracked) return;
      
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent >= 50) {
        analytics.trackEvent('homepage_scroll_engagement', {
          scroll_depth: scrollPercent,
          engagement_level: 'high'
        });
        scrollTracked = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (error) {
    return (
      <main className="relative bg-white min-h-screen flex items-center justify-center">
        <ErrorMessage 
          title="Unable to load products"
          message={error}
          retry={() => window.location.reload()}
        />
      </main>
    );
  }

  return (
    <>
      {/* Cart Drawer */}
      <CartDrawer />
      
      {/* Floating Cart Icon */}
      <CartIcon />
      
      {/* Presale Banner */}
      <PresaleBanner 
        

      />
      
      <main className="relative bg-white min-h-screen">
        {/* Enhanced Hero Section */}
        <HeroSection />

        {/* Products Grid */}
        <section className="px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold tracking-tight text-black mb-4">
                Featured Accessories
              </h2>
              <div className="w-12 h-px bg-black mx-auto" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <ProductsGrid products={products} />
            )}

            {/* Load More Button */}
            <div className="text-center mt-16">
              <Link 
                href="/collections" 
                className="btn-secondary"
                data-luxury-action="view_all_accessories"
                onClick={() => analytics.trackEvent('view_all_products_click', { source: 'homepage' })}
              >
                View All Accessories
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section - Custom Klaviyo Integration */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto">
            {/* Newsletter Box Container */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-12 shadow-lg">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-semibold tracking-tight text-black mb-4">
                  Stay Connected
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Be the first to know about new collections, exclusive offers, and luxury jewelry insights.
                </p>
              </div>
              
              {/* Custom Newsletter Form */}
              <CustomNewsletterForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}