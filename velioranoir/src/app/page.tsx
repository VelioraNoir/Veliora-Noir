// src/app/page.tsx - REPLACE ENTIRE FILE
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { getAllProductsWithFallback, Product } from '../lib/shopify';
import { ProductCardSkeleton, ErrorMessage } from '../components/ui/LoadingComponents';
import Advanced3DViewer from '../components/3d/Advanced3DScene';
import CartDrawer from '../components/cart/CartDrawer';
import { useCartStore } from '../store/cartStore';
import PresaleBanner from '../components/ui/PresaleBanner';
import SearchModal from '../components/ui/SearchModal';
import NewsletterSignup from '../components/ui/NewsletterSignup';
import Footer from '../components/layout/Footer';
import { analytics } from '../lib/analytics';
import AnalyticsTest from '../components/debug/AnalyticsTest';

// Enhanced Product Card with Cart Integration and Links - WITH ANALYTICS
const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const { addItem } = useCartStore();
  
  const mainImage = product.images[0];
  const mainVariant = product.variants[0];

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      className="block product-card rounded-2xl overflow-hidden animate-fade-in-up group h-full flex flex-col"
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
                  className="w-4 h-4 text-gray-300" 
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

          {/* Enhanced 3D Showcase */}
          <div className="animate-fade-in-up delay-400">
            <Advanced3DViewer 
              className="h-[500px]" 
              enablePostProcessing={true}
            />
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
      {/* Presale Banner */}
      <PresaleBanner 
        startDate="2024-07-10T20:00:00Z" // July 10th, 12pm PST / 9am HST
        discount="20%" 
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

        {/* Newsletter Section */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto">
            <NewsletterSignup source="homepage" />
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Temporary analytics testing
      <AnalyticsTest /> */}
    </>
  );
}