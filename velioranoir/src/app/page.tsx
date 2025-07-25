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
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-black text-center font-medium">{message}</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-xl">
          <p className="text-gray-800 text-center">{message}</p>
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
                <p className="text-2xl font-bold tracking-wider">NEWSLETTER30</p>
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
        
        {/* Product badges similar to collection pages */}
        <div className="absolute top-4 left-4 space-y-2">
          {index < 3 && (
            <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              BESTSELLER
            </div>
          )}
          {Math.random() > 0.6 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              ONLY {Math.floor(Math.random() * 5) + 2} LEFT
            </div>
          )}
          {index === 1 && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              NEW ARRIVAL
            </div>
          )}
          {index === 2 && (
            <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              LIMITED EDITION
            </div>
          )}
        </div>
        
        {/* FIXED Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
            isMounted && isInWishlist(product.id)
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-black border border-gray-200'
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
          <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm">
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
            <div className="flex items-center gap-3">
              {/* Original price crossed out */}
              <p className="text-lg font-medium text-gray-400 line-through">
                ${mainVariant?.price}
              </p>
              {/* Discounted price (20% off) */}
              <p className="text-2xl font-semibold text-black">
                ${mainVariant?.price ? (parseFloat(mainVariant.price) * 0.8).toFixed(2) : '0.00'}
              </p>
            </div>
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

// Hero Section with Enhanced Luxury Design
const HeroSection = () => {
  return (
    <section className="relative py-24 px-8 text-center overflow-hidden">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[600px]">
          {/* Enhanced Content */}
          <div className="lg:text-left space-y-8">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-700 animate-fade-in-up">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="font-medium">Premium Luxury Collection</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-7xl lg:text-8xl font-light tracking-tight text-black mb-4 animate-fade-in-up delay-100">
                <span className="block font-serif italic text-5xl lg:text-6xl text-gray-600 mb-2">Introducing</span>
                <span className="font-semibold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Veliora</span>
                <span className="block font-light">Noir</span>
              </h1>
              
              <div className="w-24 h-px bg-gradient-to-r from-black to-transparent animate-fade-in-up delay-200" />
              
              <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed animate-fade-in-up delay-300 max-w-xl">
                Where <em className="text-black font-medium">timeless craftsmanship</em> meets 
                contemporary sophistication. Each piece tells a story of 
                <em className="text-black font-medium">luxury</em> and <em className="text-black font-medium">elegance</em>.
              </p>
              
              <p className="text-lg text-gray-600 animate-fade-in-up delay-400 max-w-lg">
                Premium metallic accessories designed for those who appreciate 
                the finest details and exceptional quality.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center animate-fade-in-up delay-500">
              <Link 
                href="/collections" 
                className="group relative overflow-hidden bg-black text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:scale-105"
                data-luxury-action="hero_explore_collections"
                onClick={() => analytics.trackEvent('hero_cta_click', { cta_type: 'explore_collection' })}
              >
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg className="inline ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link 
                href="/about" 
                className="group border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:border-black hover:bg-black hover:text-white hover:shadow-lg"
                data-luxury-action="hero_our_story"
                onClick={() => analytics.trackEvent('hero_cta_click', { cta_type: 'our_story' })}
              >
                Our Story
                <svg className="inline ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </Link>
            </div>
            
            {/* Luxury indicators */}
            <div className="flex items-center gap-8 text-sm text-gray-600 animate-fade-in-up delay-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lifetime Guarantee</span>
              </div>
            </div>
          </div>

          {/* Enhanced Hero Image Showcase */}
          <div className="animate-fade-in-up delay-400 relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-200/30 to-yellow-300/30 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-gray-200/40 to-gray-300/40 rounded-full blur-xl" />
            
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-100/50">
              <Image 
                src="/images/ChatGPT Image Jul 25, 2025, 08_14_28 AM.png" 
                alt="Elegant jewelry collection showcase featuring luxury accessories"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
                      <div class="text-center p-12">
                        <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                          <svg class="w-12 h-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                          </svg>
                        </div>
                        <h3 class="text-2xl font-semibold text-gray-800 mb-4">Exquisite Craftsmanship</h3>
                        <p class="text-gray-600 text-lg leading-relaxed">Every piece tells a story of elegance, sophistication, and timeless luxury</p>
                      </div>
                    </div>
                  `;
                }}
              />
              
              {/* Floating elements */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-800">New Collection</span>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 bg-black/90 backdrop-blur-sm text-white rounded-2xl p-4 shadow-lg">
                <div className="text-sm font-medium">Premium Materials</div>
                <div className="text-xs text-gray-300">925 Sterling Silver</div>
              </div>
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
  // In your page.tsx file, replace your existing useEffect with this:

useEffect(() => {
  console.log('🧪 Testing from page.tsx');
  console.log('🧪 Env var:', process.env.NEXT_PUBLIC_META_PIXEL_ID);

  // Force analytics initialization
  import('../lib/analytics').then(({ initializeAnalytics }) => {
    initializeAnalytics();
    
    // Add debugging after pixel loads
    setTimeout(() => {
      console.log('🔍 Debugging pixel status...');
      
      // Check for duplicate pixels
      console.log('📊 All fbq instances:', typeof window.fbq);
      console.log('📊 fbq queue length:', window.fbq?.q?.length || 0);
      console.log('📊 fbq queue:', window.fbq?.q || []);
      
      // Check dataLayer
      console.log('📊 dataLayer:', window.dataLayer || 'Not found');
      
      // Check for multiple pixel scripts
      const fbScripts = document.querySelectorAll('script[src*="fbevents"]');
      console.log('📊 Number of fbevents scripts:', fbScripts.length);
      
      // Check for other tracking pixels that might conflict
      const allScripts = document.querySelectorAll('script');
      const trackingScripts = Array.from(allScripts).filter(script => 
        script.src && (
          script.src.includes('facebook') || 
          script.src.includes('gtag') || 
          script.src.includes('analytics') ||
          script.src.includes('pixel')
        )
      );
      console.log('📊 All tracking scripts:', trackingScripts.map(s => s.src));
      
      // Test if pixel is responsive
      if (window.fbq) {
        console.log('🧪 Testing pixel responsiveness...');
        window.fbq('track', 'PageView', { test_event: true });
        console.log('🧪 Test PageView sent');
      }
      
    }, 3000); // Wait 3 seconds for everything to load
  });
}, []);

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

        {/* The Art of Luxury Craftsmanship Section */}
        <section className="py-32 px-8 bg-gradient-to-br from-gray-100 via-white to-gray-50 relative overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-black/3 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-yellow-400/10 to-transparent rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {/* Story Content */}
              <div className="space-y-10">
                <div className="space-y-8">
                  <h2 className="text-6xl lg:text-7xl font-light tracking-tight text-black mb-8">
                    <span className="block text-2xl lg:text-3xl text-gray-600 font-serif italic mb-6">The Art of</span>
                    <span className="font-semibold">Luxury</span>
                    <span className="block font-light text-gray-800">Craftsmanship</span>
                  </h2>
                  
                  <div className="w-32 h-px bg-gradient-to-r from-black via-yellow-400 to-transparent" />
                </div>
                
                <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
                  <p className="text-xl">
                    Born from a passion for <span className="text-black font-semibold">exceptional artistry</span>, 
                    Veliora Noir represents the pinnacle of luxury jewelry design. Each piece is 
                    meticulously crafted by master artisans who have dedicated their lives to 
                    perfecting the ancient art of metalwork.
                  </p>
                  
                  <p>
                    Our journey began with a simple belief: that true luxury lies not just in 
                    precious materials, but in the <span className="text-black font-semibold">soul and story</span> 
                    behind every creation. Every curve, every detail, every reflection of light 
                    is carefully considered and expertly executed.
                  </p>
                  
                  <p>
                    From the selection of the finest 925 sterling silver to the final polish 
                    that reveals each piece&rsquo;s inner radiance, we maintain 
                    <span className="text-black font-semibold"> uncompromising standards</span> that 
                    have made Veliora Noir synonymous with luxury and elegance.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    href="/about" 
                    className="group bg-black text-white px-10 py-5 rounded-xl font-semibold tracking-wide transition-all duration-300 hover:bg-gray-900 hover:shadow-xl hover:scale-105"
                    onClick={() => analytics.trackEvent('craftsmanship_cta_click', { cta_type: 'learn_more' })}
                  >
                    <span>Discover Our Heritage</span>
                    <svg className="inline ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  
                  <Link 
                    href="/care" 
                    className="group border-2 border-gray-300 text-gray-900 px-10 py-5 rounded-xl font-semibold tracking-wide transition-all duration-300 hover:border-black hover:bg-black hover:text-white hover:shadow-xl"
                    onClick={() => analytics.trackEvent('craftsmanship_cta_click', { cta_type: 'care_guide' })}
                  >
                    <span>Care & Maintenance</span>
                    <svg className="inline ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Refined Excellence Pillars */}
              <div className="space-y-12">
                <div className="text-center mb-16">
                  <h3 className="text-3xl font-semibold text-black mb-4">Pillars of Excellence</h3>
                  <div className="w-16 h-px bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto" />
                </div>

                <div className="space-y-8">
                  {/* Master Artisans */}
                  <div className="group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-yellow-400/30 transition-all duration-500">
                    <div className="flex items-start gap-6">
                      <div className="w-2 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full flex-shrink-0 mt-2" />
                      <div>
                        <h4 className="text-2xl font-semibold text-black mb-4 tracking-wide">Master Artisans</h4>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          Each piece is crafted by skilled artisans with over two decades of experience 
                          in luxury jewelry making, ensuring unparalleled quality and meticulous attention to detail.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Premium Materials */}
                  <div className="group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-yellow-400/30 transition-all duration-500">
                    <div className="flex items-start gap-6">
                      <div className="w-2 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full flex-shrink-0 mt-2" />
                      <div>
                        <h4 className="text-2xl font-semibold text-black mb-4 tracking-wide">Exceptional Materials</h4>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          Only the finest 925 sterling silver and ethically sourced gemstones are selected, 
                          each carefully chosen for its exceptional quality and natural beauty.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lifetime Quality */}
                  <div className="group p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-yellow-400/30 transition-all duration-500">
                    <div className="flex items-start gap-6">
                      <div className="w-2 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full flex-shrink-0 mt-2" />
                      <div>
                        <h4 className="text-2xl font-semibold text-black mb-4 tracking-wide">Timeless Quality</h4>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          Every piece comes with our lifetime craftsmanship guarantee, reflecting our 
                          unwavering confidence in the enduring quality and timeless design of our creations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elegant quote */}
                <div className="text-center pt-8">
                  <p className="text-lg text-gray-600 italic font-light">
                    &ldquo;Excellence is never an accident. It is always the result of high intention, 
                    sincere effort, and intelligent execution.&rdquo;
                  </p>
                  <div className="w-8 h-px bg-yellow-400 mx-auto mt-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-700 mb-6">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="font-medium">Curated Collection</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-light tracking-tight text-black mb-6">
                <span className="block text-2xl lg:text-3xl text-gray-600 font-serif italic mb-4">Discover</span>
                <span className="font-semibold">Featured</span>
                <span className="block font-light text-gray-800">Accessories</span>
              </h2>
              
              <div className="w-24 h-px bg-gradient-to-r from-black to-transparent mx-auto mb-8" />
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Each piece in our featured collection represents the pinnacle of luxury craftsmanship, 
                carefully selected for its exceptional beauty and timeless appeal.
              </p>
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

            {/* Enhanced View All Button */}
            <div className="text-center mt-20">
              <p className="text-lg text-gray-600 mb-8">
                Explore our complete collection of luxury accessories
              </p>
              <Link 
                href="/collections" 
                className="group inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-2xl font-medium text-lg transition-all duration-300 hover:bg-gray-900 hover:shadow-xl hover:scale-105"
                data-luxury-action="view_all_accessories"
                onClick={() => analytics.trackEvent('view_all_products_click', { source: 'homepage' })}
              >
                <span>View All Accessories</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Luxury Showcase Image Section */}
        <section className="py-24 px-8 bg-gradient-to-br from-gray-100 via-gray-50 to-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-black/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-200/20 to-transparent rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image Showcase */}
              <div className="relative">
                <div className="aspect-[4/5] bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
                    {/* Elegant placeholder content */}
                    <div className="text-center p-12">
                      <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center shadow-xl">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-3xl font-semibold text-gray-800 mb-6">Signature Collection</h3>
                      <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
                        Discover our most coveted pieces, each representing the ultimate expression 
                        of luxury craftsmanship and timeless design.
                      </p>
                    </div>
                    
                    {/* Floating elements for luxury feel */}
                    <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-gray-800">Limited Edition</span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-8 left-8 bg-black/90 backdrop-blur-sm text-white rounded-2xl p-4 shadow-lg">
                      <div className="text-sm font-medium">Premium Quality</div>
                      <div className="text-xs text-gray-300">Since 1890</div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative frame elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-black/10 rounded-tl-3xl" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-black/10 rounded-br-3xl" />
              </div>

              {/* Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="font-medium">Artisan Excellence</span>
                  </div>
                  
                  <h2 className="text-5xl lg:text-6xl font-light tracking-tight text-black">
                    <span className="block text-2xl lg:text-3xl text-gray-600 font-serif italic mb-4">Where Art Meets</span>
                    <span className="font-semibold">Perfection</span>
                  </h2>
                  
                  <div className="w-24 h-px bg-gradient-to-r from-black to-transparent" />
                </div>
                
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Every piece in our signature collection undergoes a meticulous creation process 
                    that can take up to <span className="text-black font-medium">180 hours of handwork</span>. 
                    Our master artisans pour their expertise and passion into each detail.
                  </p>
                  
                  <p>
                    From the initial sketch to the final polish, we maintain an unwavering commitment 
                    to <span className="text-black font-medium">exceptional quality</span> that has 
                    defined luxury jewelry for generations.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/collections" 
                    className="group bg-black text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:scale-105"
                    onClick={() => analytics.trackEvent('signature_collection_cta_click', { cta_type: 'view_collection' })}
                  >
                    <span>View Collection</span>
                    <svg className="inline ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  
                  <Link 
                    href="/about" 
                    className="group border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:border-black hover:bg-black hover:text-white hover:shadow-lg"
                    onClick={() => analytics.trackEvent('signature_collection_cta_click', { cta_type: 'our_process' })}
                  >
                    Our Process
                    <svg className="inline ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Luxury Redefined Section */}
        <section className="py-32 px-8 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-400/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/3 to-transparent rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-6xl lg:text-7xl font-light tracking-tight text-white mb-8">
                <span className="block text-2xl lg:text-3xl text-gray-400 font-serif italic mb-6">Experience</span>
                <span className="font-semibold">Luxury</span>
                <span className="block font-light text-gray-200">Redefined</span>
              </h2>
              
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-12" />
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Every aspect of our service is meticulously crafted to exceed the highest standards 
                of luxury, creating an unparalleled experience worthy of discerning connoisseurs.
              </p>
            </div>

            {/* Elegant grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
              {/* Left column */}
              <div className="space-y-12">
                {/* Worldwide Shipping */}
                <div className="group">
                  <div className="flex items-start gap-6 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-yellow-400/30 transition-all duration-500">
                    <div className="w-1 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full flex-shrink-0 mt-2" />
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4 tracking-wide">Complimentary Worldwide Delivery</h3>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        White-glove service to over 100 countries with full insurance coverage, 
                        signature tracking, and discreet packaging befitting luxury.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secure Payments */}
                <div className="group">
                  <div className="flex items-start gap-6 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-yellow-400/30 transition-all duration-500">
                    <div className="w-1 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full flex-shrink-0 mt-2" />
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4 tracking-wide">Private & Secure Transactions</h3>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        Bank-level encryption and discretionary payment options ensuring 
                        complete privacy and security for every transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-12">
                {/* Returns */}
                <div className="group">
                  <div className="flex items-start gap-6 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-yellow-400/30 transition-all duration-500">
                    <div className="w-1 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full flex-shrink-0 mt-2" />
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4 tracking-wide">Unconditional 30-Day Returns</h3>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        Shop with absolute confidence knowing every purchase may be returned 
                        within 30 days for a complete refund, no questions asked.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Elegant call to action */}
            <div className="text-center">
              <p className="text-xl text-gray-300 mb-12 italic">
                &ldquo;Luxury is in each detail&rdquo; — Hubert de Givenchy
              </p>
              <Link 
                href="/collections" 
                className="group inline-flex items-center gap-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-12 py-6 rounded-xl font-semibold text-lg tracking-wide transition-all duration-300 hover:from-yellow-300 hover:to-yellow-400 hover:shadow-2xl hover:scale-105"
                onClick={() => analytics.trackEvent('luxury_redefined_cta_click', { cta_type: 'discover_collection' })}
              >
                <span>Discover the Collection</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Reviews & Testimonials Section */}
        <section className="py-20 px-8 bg-gradient-to-br from-gray-50/50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold tracking-tight text-black mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of satisfied customers who trust Veliora Noir for their luxury jewelry needs.
              </p>
              <div className="w-12 h-px bg-black mx-auto" />
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">50K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">4.9</div>
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">24/7</div>
                <div className="text-sm text-gray-600">Customer Support</div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Review 1 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  &ldquo;Absolutely stunning pieces! The craftsmanship is impeccable and the customer service was outstanding. My necklace arrived beautifully packaged and exceeded all my expectations.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-gray-300">
                    <Image src="/AI people/women2.png" alt="Sarah Martinez" width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <div className="font-semibold text-black">Sarah Martinez</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  &ldquo;I&rsquo;ve purchased multiple pieces from Veliora Noir and each one is a masterpiece. The attention to detail and quality is unmatched. Fast shipping and secure packaging too!&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-gray-300">
                    <Image src="/AI people/women3.png" alt="Emily Wilson" width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <div className="font-semibold text-black">Emily Wang</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  &ldquo;The perfect engagement ring! My fiancé absolutely loves it. The diamond quality is exceptional and the design is both modern and timeless. Highly recommended!&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-gray-300">
                    <Image src="/AI people/women4.png" alt="Michael Chen" width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <div className="font-semibold text-black">Michael Johnson</div>
                    <div className="text-sm text-gray-500">Verified Customer</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>  
                <span className="text-sm font-medium text-gray-700">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">30-Day Returns</span>
              </div>
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