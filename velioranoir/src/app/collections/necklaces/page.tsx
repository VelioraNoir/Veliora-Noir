// src/app/collections/necklaces/page.tsx - LUXURY REVAMP
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProductsWithFallback, Product } from '../../../lib/shopify';
import { ProductCardSkeleton, ErrorMessage } from '../../../components/ui/LoadingComponents';
import { useCartStore } from '../../../store/cartStore';
import { analytics } from '../../../lib/analytics';

export default function Necklaces() {
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
        
        // Filter products by type - necklaces only
        const necklaces = allProducts.filter(product => 
          product.productType?.toLowerCase() === 'necklace' ||
          product.productType?.toLowerCase() === 'necklaces' ||
          product.tags.some(tag => tag.toLowerCase().includes('necklace'))
        );
        
        setProducts(necklaces);
        
        // TRACK COLLECTION VIEW
        analytics.viewCategory('Necklaces', necklaces.length);
        
        // TRACK PAGE VIEW
        analytics.pageView('Necklaces Collection', 'collection');
        
        // Track luxury collection engagement
        analytics.trackEvent('luxury_collection_view', {
          collection_name: 'Necklaces',
          products_available: necklaces.length,
          collection_type: 'jewelry',
          user_intent: 'product_discovery'
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        
        // Track collection load error
        analytics.trackEvent('collection_load_error', {
          collection_name: 'Necklaces',
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
          collection_name: 'Necklaces',
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
        collection_name: 'Necklaces',
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
      collection_name: 'Necklaces',
      product_position: products.findIndex(p => p.id === product.id) + 1,
      total_products: products.length
    });
    
    // Track product view
    analytics.productView(
      product.id,
      product.title,
      product.variants[0]?.price || '0',
      'Necklace'
    );
  };

  const filteredProducts = products.filter(product => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pendant') return product.title.toLowerCase().includes('pendant') || product.title.toLowerCase().includes('charm');
    if (selectedFilter === 'chain') return product.title.toLowerCase().includes('chain') || product.title.toLowerCase().includes('link');
    if (selectedFilter === 'statement') return product.title.toLowerCase().includes('statement') || product.title.toLowerCase().includes('bold');
    return true;
  });

  if (error) {
    return (
      <main className="relative bg-white min-h-screen pt-28 px-8">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage 
            title="Unable to load necklaces"
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
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-amber-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-rose-200/20 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Compelling Content */}
            <div className="lg:text-left space-y-8">
              {/* Exclusive Badge */}
              <div className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm rounded-full px-6 py-3 text-sm text-gray-700 animate-fade-in-up">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Signature Necklace Collection • Hand-Selected</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-7xl lg:text-8xl font-light tracking-tight text-black mb-4 animate-fade-in-up delay-100">
                  <span className="block font-serif italic text-4xl lg:text-5xl text-gray-600 mb-2">Grace Your</span>
                  <span className="font-semibold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Neckline</span>
                </h1>
                
                <div className="w-24 h-px bg-gradient-to-r from-black to-transparent animate-fade-in-up delay-200" />
                
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed animate-fade-in-up delay-300 max-w-xl">
                  From <em className="text-black font-medium">delicate pendants</em> to 
                  <em className="text-black font-medium"> statement pieces</em>, each necklace is 
                  crafted to frame your beauty and reflect your unique style.
                </p>
                
                <p className="text-lg text-gray-600 animate-fade-in-up delay-400 max-w-lg">
                  Meticulously designed by our artisans, every chain link and setting 
                  embodies the perfect harmony of elegance and craftsmanship.
                </p>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center gap-8 text-sm text-gray-600 animate-fade-in-up delay-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-rose-600">✨</span>
                      </div>
                    ))}
                  </div>
                  <span className="font-medium">25,000+ women love our necklaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-medium">4.8/5 stars (3,241 reviews)</span>
                </div>
              </div>
              
              {/* Luxury CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center animate-fade-in-up delay-600">
                <button 
                  className="group relative overflow-hidden bg-black text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:bg-gray-900 hover:shadow-xl hover:scale-105"
                  onClick={() => analytics.trackEvent('necklaces_hero_cta', { cta_type: 'layering_guide' })}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Layering Guide
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                
                <button 
                  className="group border-2 border-gray-300 text-gray-900 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:border-black hover:bg-black hover:text-white hover:shadow-xl"
                  onClick={() => analytics.trackEvent('necklaces_hero_cta', { cta_type: 'shop_now' })}
                >
                  Shop Now
                </button>
              </div>
              
              {/* Urgency Indicators */}
              <div className="space-y-3 animate-fade-in-up delay-700">
              </div>
            </div>

            {/* Enhanced Hero Showcase */}
            <div className="animate-fade-in-up delay-400 relative">
              {/* Premium decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-rose-200/20 to-rose-300/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-amber-300/30 rounded-full blur-2xl" />
              
              <div className="relative aspect-square bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-3xl overflow-hidden shadow-2xl border border-gray-100/50">
                <Image 
                  src="/images/necklace.png" 
                  alt="Luxury necklace collection featuring elegant chains and pendants"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-1000"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50">
                        <div class="text-center p-12">
                          <div class="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center shadow-lg">
                            <svg class="w-16 h-16 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                          </div>
                          <h3 class="text-3xl font-semibold text-gray-800 mb-6">Timeless Grace</h3>
                          <p class="text-gray-600 text-lg leading-relaxed">Discover necklaces that complement your natural beauty with sophisticated elegance</p>
                        </div>
                      </div>
                    `;
                  }}
                />
                
                {/* Premium floating elements */}
                <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-800">Limited Edition</span>
                  </div>
                </div>
                
                <div className="absolute bottom-8 left-8 bg-black/90 backdrop-blur-sm text-white rounded-2xl p-4 shadow-xl">
                  <div className="text-sm font-medium">From</div>
                  <div className="text-lg font-bold">$27.99 <span className="text-xs opacity-75 line-through">$34.99</span></div>
                </div>
                
                <div className="absolute top-1/2 left-8 bg-rose-500 text-white rounded-2xl p-3 shadow-xl transform -translate-y-1/2">
                  <div className="text-xs font-bold">20% OFF</div>
                  <div className="text-xs">Today Only</div>
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
              { id: 'all', label: 'All Necklaces' },
              { id: 'pendant', label: 'Pendants' },
              { id: 'chain', label: 'Chains' },
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
              <div className="bg-gradient-to-br from-rose-50 to-white border border-gray-200 rounded-3xl p-16 shadow-lg">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-playfair font-semibold tracking-tight text-black mb-6">
                  Exquisite Collection In Progress
                </h2>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                  Our artisans are carefully crafting pieces that will elevate your style. 
                  Be among the first to discover these treasures.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 hover:shadow-xl"
                    onClick={() => analytics.trackEvent('necklaces_notify_me', { filter: selectedFilter })}
                  >
                    Be First to Know
                  </button>
                  <button 
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-medium hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                    onClick={() => analytics.trackEvent('necklaces_custom_design', { filter: selectedFilter })}
                  >
                    Commission Bespoke Piece
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="group bg-gradient-to-br from-rose-50 to-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                  <Link 
                    href={`/products/${encodeURIComponent(product.id)}`}
                    onClick={() => handleProductClick(product)}
                    className="block relative"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={product.images[0]?.src || '/images/necklace.png'}
                        alt={product.images[0]?.altText || product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      
                      {/* Premium overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      
                      {/* Exclusive badges */}
                      <div className="absolute top-4 left-4 space-y-2">
                        {index < 2 && (
                          <div className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            TRENDING
                          </div>
                        )}
                        {Math.random() > 0.6 && (
                          <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            LIMITED
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
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
                          Add to Collection
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
                          {product.productType || 'Necklace'}
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
                        <span className="text-sm text-gray-500">(4.8)</span>
                      </div>
                      
                      {/* Pricing with discount */}
                      <div className="flex items-center gap-3 mb-4">
                        <p className="text-lg font-medium text-gray-400 line-through">
                          ${product.variants[0]?.price}
                        </p>
                        <p className="text-2xl font-semibold text-black">
                          ${product.variants[0]?.price ? (parseFloat(product.variants[0].price) * 0.8).toFixed(2) : '0.00'}
                        </p>
                        <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs font-bold">
                          20% OFF
                        </span>
                      </div>
                      
                      {/* Luxury features */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Hypoallergenic materials</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/products/${encodeURIComponent(product.id)}`}
                      onClick={() => handleProductClick(product)}
                      className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-medium text-center hover:bg-gray-200 transition-all duration-300 group-hover:bg-black group-hover:text-white"
                    >
                      Discover More
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
            <h2 className="text-4xl font-semibold text-black mb-4">Stories of Elegance</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              How our necklaces became part of their most cherished moments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Isabella Chen",
                occasion: "Anniversary Gift",
                text: "My husband gave me this delicate pendant for our anniversary. It's so beautifully crafted and I haven't taken it off since. The chain feels luxurious and the pendant catches the light perfectly.",
                rating: 5,
                image: "👩‍🦳"
              },
              {
                name: "Sophia Williams",
                occasion: "Birthday Present",
                text: "I bought this statement necklace for my birthday and it's become my signature piece. Every time I wear it, I get compliments. The quality is exceptional and it elevates every outfit.",
                rating: 5,
                image: "👩‍🎨"
              },
              {
                name: "Grace Thompson",
                occasion: "Wedding Day",
                text: "I wore this vintage-inspired necklace on my wedding day and felt like a queen. It was the perfect complement to my dress and I'll treasure it forever. Pure elegance!",
                rating: 5,
                image: "👰"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-rose-50 to-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
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
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center mr-4 text-xl">
                    {testimonial.image}
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

      {/* Layering & Styling Guide */}
      <section className="px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 rounded-3xl p-12 border border-gray-200 shadow-lg">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-black mb-4">The Art of Layering</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create your unique style by masterfully combining our necklaces
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Start Simple",
                  description: "Begin with a delicate chain as your foundation piece"
                },
                {
                  title: "Vary Lengths",
                  description: "Mix short, medium, and long pieces for visual interest"
                },
                {
                  title: "Add Focal Points",
                  description: "Include one statement piece to anchor your look"
                },
                {
                  title: "Balance Textures",
                  description: "Combine smooth chains with textured or pendant pieces"
                }
              ].map((tip, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-semibold text-black mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 hover:shadow-xl">
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Care & Maintenance */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-playfair font-semibold text-black mb-4">
                Preserving Your Necklace&rsquo;s Beauty
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Simple care rituals to ensure your necklaces remain as stunning as the day you received them
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Daily Care
                </h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Store separately to prevent tangling and scratching
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Remove before applying perfume, lotion, or hairspray
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Keep away from direct sunlight and moisture
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  Gentle Cleaning
                </h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></span>
                    Use a soft, lint-free cloth for regular polishing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></span>
                    For deeper cleaning, use mild soap and warm water
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></span>
                    Professional cleaning service available upon request
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-black hover:bg-black hover:text-white transition-all duration-300">
                Download Care Guide
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}