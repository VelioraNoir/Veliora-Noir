// src/app/collections/rings/page.tsx - LUXURY REVAMP
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProductsWithFallback, Product } from '../../../lib/shopify';
import { ProductCardSkeleton, ErrorMessage } from '../../../components/ui/LoadingComponents';
import { useCartStore } from '../../../store/cartStore';
import { analytics } from '../../../lib/analytics';

export default function Rings() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { addItem } = useCartStore();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProductsWithFallback();
        
        // Filter products by type - rings only
        const rings = allProducts.filter(product => 
          product.productType?.toLowerCase() === 'ring' ||
          product.productType?.toLowerCase() === 'rings' ||
          product.tags.some(tag => tag.toLowerCase().includes('ring'))
        );
        
        setProducts(rings);
        
        // TRACK COLLECTION VIEW
        analytics.viewCategory('Rings', rings.length);
        
        // TRACK PAGE VIEW
        analytics.pageView('Rings Collection', 'collection');
        
        // Track luxury collection engagement
        analytics.trackEvent('luxury_collection_view', {
          collection_name: 'Rings',
          products_available: rings.length,
          collection_type: 'jewelry',
          user_intent: 'product_discovery'
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        
        // Track collection load error
        analytics.trackEvent('collection_load_error', {
          collection_name: 'Rings',
          error_message: err instanceof Error ? err.message : 'unknown_error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Track scroll engagement for collection pages
  useEffect(() => {
    let scrollTracked = false;
    
    const handleScroll = () => {
      if (scrollTracked) return;
      
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent >= 25) {
        analytics.trackEvent('collection_scroll_engagement', {
          collection_name: 'Rings',
          scroll_depth: scrollPercent,
          engagement_level: 'browsing'
        });
        scrollTracked = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product: Product, material: string = 'Silver') => {
    const mainVariant = product.variants[0];
    if (mainVariant?.available) {
      addItem(product, mainVariant.id);
      
      // TRACK ADD TO CART FROM COLLECTION
      analytics.addToCart(
        product.id,
        product.title,
        mainVariant.price,
        1
      );
      
      // Track quick add from collection
      analytics.trackEvent('collection_quick_add', {
        product_id: product.id,
        product_name: product.title,
        collection_name: 'Rings',
        material_selected: material,
        add_method: 'quick_add_button'
      });
    }
  };

  const handleProductClick = (product: Product) => {
    // Track product click from collection
    analytics.trackEvent('collection_product_click', {
      product_id: product.id,
      product_name: product.title,
      collection_name: 'Rings',
      product_position: products.findIndex(p => p.id === product.id) + 1,
      total_products: products.length
    });
    
    // Track product view
    analytics.productView(
      product.id,
      product.title,
      product.variants[0]?.price || '0',
      'Ring'
    );
  };

  const filteredProducts = products.filter(product => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'engagement') return product.title.toLowerCase().includes('engagement') || product.title.toLowerCase().includes('solitaire');
    if (selectedFilter === 'wedding') return product.title.toLowerCase().includes('wedding') || product.title.toLowerCase().includes('band');
    if (selectedFilter === 'statement') return product.title.toLowerCase().includes('statement') || product.title.toLowerCase().includes('cocktail');
    return true;
  });

  if (error) {
    return (
      <main className="relative bg-white min-h-screen pt-28 px-8">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage 
            title="Unable to load rings"
            message={error}
            retry={() => window.location.reload()}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-white min-h-screen pt-20">
      {/* Ultra-Luxury Hero Section */}
      <section className="relative py-24 px-8 overflow-hidden">
        {/* Elegant background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-gray-200/20 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Compelling Content */}
            <div className="lg:text-left space-y-8">
              {/* Exclusive Badge */}
              <div className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm rounded-full px-6 py-3 text-sm text-gray-700 animate-fade-in-up">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Exclusive Ring Collection • Limited Edition</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-7xl lg:text-8xl font-light tracking-tight text-black mb-4 animate-fade-in-up delay-100">
                  <span className="block font-serif italic text-4xl lg:text-5xl text-gray-600 mb-2">Forever Begins With</span>
                  <span className="font-semibold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Perfection</span>
                </h1>
                
                <div className="w-24 h-px bg-gradient-to-r from-black to-transparent animate-fade-in-up delay-200" />
                
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed animate-fade-in-up delay-300 max-w-xl">
                  From <em className="text-black font-medium">breathtaking engagement rings</em> to 
                  <em className="text-black font-medium"> timeless wedding bands</em>, each piece is 
                  meticulously crafted to symbolize your eternal love story.
                </p>
                
                <p className="text-lg text-gray-600 animate-fade-in-up delay-400 max-w-lg">
                  Crafted by master artisans using ethically sourced materials and 
                  time-honored techniques passed down through generations.
                </p>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center gap-8 text-sm text-gray-600 animate-fade-in-up delay-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">♥</span>
                      </div>
                    ))}
                  </div>
                  <span className="font-medium">15,000+ couples trust us</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-medium">4.9/5 stars (2,847 reviews)</span>
                </div>
              </div>
              
              {/* Luxury CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center animate-fade-in-up delay-600">
                <button 
                  className="group relative overflow-hidden bg-black text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:bg-gray-900 hover:shadow-xl hover:scale-105"
                  onClick={() => analytics.trackEvent('rings_hero_cta', { cta_type: 'view_collection' })}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Collection
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
              
              {/* Urgency Indicators */}
              <div className="space-y-3 animate-fade-in-up delay-700">
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-full px-4 py-2 inline-flex">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Limited Holiday Collection - Only 48 hours left</span>
                </div>
              </div>
            </div>

            {/* Enhanced Hero Showcase */}
            <div className="animate-fade-in-up delay-400 relative">
              {/* Premium decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-200/20 to-yellow-300/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-gray-200/30 to-gray-300/30 rounded-full blur-2xl" />
              
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-100/50">
                <Image 
                  src="/images/ring.png" 
                  alt="Luxury engagement and wedding rings collection"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-1000"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
                        <div class="text-center p-12">
                          <div class="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center shadow-lg">
                            <svg class="w-16 h-16 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                            </svg>
                          </div>
                          <h3 class="text-3xl font-semibold text-gray-800 mb-6">Eternal Elegance</h3>
                          <p class="text-gray-600 text-lg leading-relaxed">Discover rings that capture the essence of your love story with unparalleled craftsmanship</p>
                        </div>
                      </div>
                    `;
                  }}
                />
                
                {/* Premium floating elements */}
                <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-800">In Stock & Ready</span>
                  </div>
                </div>
                
                <div className="absolute bottom-8 left-8 bg-black/90 backdrop-blur-sm text-white rounded-2xl p-4 shadow-xl">
                  <div className="text-sm font-medium">Starting from</div>
                  <div className="text-lg font-bold">$19.99 <span className="text-xs opacity-75 line-through">$24.99</span></div>
                </div>
                
                <div className="absolute top-1/2 left-8 bg-yellow-500 text-black rounded-2xl p-3 shadow-xl transform -translate-y-1/2">
                  <div className="text-xs font-bold">20% OFF</div>
                  <div className="text-xs">Limited Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: 'all', label: 'All Rings' },
              { id: 'engagement', label: 'Engagement' },
              { id: 'wedding', label: 'Wedding Bands' },
              { id: 'statement', label: 'Statement' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedFilter === filter.id
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-16 shadow-lg">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-4xl font-playfair font-semibold tracking-tight text-black mb-6">
                  Exclusive Collection Coming Soon
                </h2>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                  Our master craftsmen are putting the finishing touches on extraordinary pieces 
                  that will redefine luxury. Be the first to know when they arrive.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 hover:shadow-xl"
                    onClick={() => analytics.trackEvent('rings_notify_me', { filter: selectedFilter })}
                  >
                    Notify Me First
                  </button>
                  <button 
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-medium hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                    onClick={() => analytics.trackEvent('rings_custom_inquiry', { filter: selectedFilter })}
                  >
                    Request Custom Design
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="group bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                  <Link 
                    href={`/products/${encodeURIComponent(product.id)}`}
                    onClick={() => handleProductClick(product)}
                    className="block relative"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={product.images[0]?.src || '/placeholder-product.jpg'}
                        alt={product.images[0]?.altText || product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      
                      {/* Premium overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      
                      {/* Exclusive badges */}
                      <div className="absolute top-4 left-4 space-y-2">
                        {index < 3 && (
                          <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            BESTSELLER
                          </div>
                        )}
                        {Math.random() > 0.7 && (
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            ONLY 2 LEFT
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200">
                          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200">
                          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Quick Add Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="bg-white text-black px-6 py-3 rounded-xl font-medium shadow-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                        >
                          Quick Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Enhanced Product Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      {/* Product category */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          {product.productType || 'Ring'}
                        </span>
                        {product.vendor && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{product.vendor}</span>
                          </>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-medium text-black mb-2 line-clamp-2 group-hover:text-gray-800 transition-colors">
                        {product.title}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">(4.9)</span>
                      </div>
                      
                      {/* Pricing with discount */}
                      <div className="flex items-center gap-3 mb-4">
                        <p className="text-lg font-medium text-gray-400 line-through">
                          ${product.variants[0]?.price}
                        </p>
                        <p className="text-2xl font-semibold text-black">
                          ${product.variants[0]?.price ? (parseFloat(product.variants[0].price) * 0.8).toFixed(2) : '0.00'}
                        </p>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                          20% OFF
                        </span>
                      </div>
                      
                      {/* Luxury features */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Free lifetime resizing</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Ethically sourced materials</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Certificate of authenticity</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/products/${encodeURIComponent(product.id)}`}
                      onClick={() => handleProductClick(product)}
                      className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-medium text-center hover:bg-gray-200 transition-all duration-300 group-hover:bg-black group-hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-black mb-4">Love Stories in Every Ring</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real couples sharing their Veliora Noir moments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah & Michael",
                occasion: "Engagement",
                text: "The ring was absolutely perfect! The craftsmanship is incredible and Michael's proposal was unforgettable. We get compliments everywhere we go.",
                rating: 5,
                image: "/AI people/women5.png"
              },
              {
                name: "Emma & James",
                occasion: "Wedding Bands",
                text: "We chose matching bands and they're stunning. The comfort fit is amazing and the quality exceeded our expectations. Worth every penny!",
                rating: 5,
                image: "/AI people/man1.png"
              },
              {
                name: "Lisa & David",
                occasion: "Anniversary",
                text: "For our 10th anniversary, David surprised me with a beautiful eternity band. The diamonds are so brilliant and it pairs perfectly with my engagement ring.",
                rating: 5,
                image: "/AI people/women6.png"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-gray-300">
                    <Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <div className="font-semibold text-black">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.occasion}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </main>
  );
}