// src/app/collections/bracelets/page.tsx - REPLACE ENTIRE FILE
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProductsWithFallback, Product } from '../../../lib/shopify';
import { ProductCardSkeleton, ErrorMessage } from '../../../components/ui/LoadingComponents';
import { useCartStore } from '../../../store/cartStore';
import { analytics } from '../../../lib/analytics';

export default function Bracelets() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProductsWithFallback();
        
        // Filter products by type - bracelets only
        const bracelets = allProducts.filter(product => 
          product.productType?.toLowerCase() === 'bracelet' ||
          product.productType?.toLowerCase() === 'bracelets' ||
          product.tags.some(tag => tag.toLowerCase().includes('bracelet'))
        );
        
        setProducts(bracelets);
        
        // TRACK COLLECTION VIEW
        analytics.viewCategory('Bracelets', bracelets.length);
        
        // TRACK PAGE VIEW
        analytics.pageView('Bracelets Collection', 'collection');
        
        // Track luxury collection engagement
        analytics.trackEvent('luxury_collection_view', {
          collection_name: 'Bracelets',
          products_available: bracelets.length,
          collection_type: 'jewelry',
          user_intent: 'product_discovery'
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        
        // Track collection load error
        analytics.trackEvent('collection_load_error', {
          collection_name: 'Bracelets',
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
          collection_name: 'Bracelets',
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
        collection_name: 'Bracelets',
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
      collection_name: 'Bracelets',
      product_position: products.findIndex(p => p.id === product.id) + 1,
      total_products: products.length
    });
    
    // Track product view
    analytics.productView(
      product.id,
      product.title,
      product.variants[0]?.price || '0',
      'Bracelet'
    );
  };

  if (error) {
    return (
      <main className="relative bg-white min-h-screen pt-28 px-8">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage 
            title="Unable to load bracelets"
            message={error}
            retry={() => window.location.reload()}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-white min-h-screen pt-28">
      {/* Hero Section */}
      <section className="px-8 pb-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-playfair font-bold tracking-tight text-black mb-6">
            Bracelets
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Refined wrist accessories that combine metallic artistry 
            with modern elegance and timeless style.
          </p>
          
          {/* Collection Stats */}
          {products.length > 0 && (
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mt-6">
              <span>{products.length} piece{products.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>Adjustable sizing</span>
              <span>•</span>
              <span>Premium finishes</span>
            </div>
          )}
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
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass-card p-12">
                <h2 className="text-3xl font-playfair font-semibold tracking-tight text-black mb-4">
                  Coming Soon
                </h2>
                <p className="text-gray-600 mb-8">
                  Our bracelet collection showcases intricate metalwork 
                  and contemporary design in perfect harmony.
                </p>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    analytics.trackEvent('collection_notify_me_click', {
                      collection_name: 'Bracelets',
                      user_intent: 'future_purchase_interest'
                    });
                  }}
                  data-luxury-action="notify_me_bracelets"
                >
                  Notify Me
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="product-card rounded-2xl overflow-hidden group h-full flex flex-col">
                  <Link 
                    href={`/products/${encodeURIComponent(product.id)}`}
                    onClick={() => handleProductClick(product)}
                    className="block"
                    data-luxury-action="bracelet_product_click"
                  >
                    <div className="product-card-image aspect-square relative">
                      <Image
                        src={product.images[0]?.src || '/placeholder-product.jpg'}
                        alt={product.images[0]?.altText || product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      
                      {/* Quick Add Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="btn-primary text-sm"
                          data-luxury-action="bracelet_quick_add"
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Product Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-black mb-2">
                        {product.title}
                      </h3>
                      <p className="text-2xl font-semibold text-black mb-4">
                        ${product.variants[0]?.price}
                      </p>
                    </div>
                    
                    <Link 
                      href={`/products/${encodeURIComponent(product.id)}`}
                      onClick={() => handleProductClick(product)}
                      className="w-full btn-secondary block text-center"
                      data-luxury-action="bracelet_view_details"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bracelet Sizing Guide */}
          {products.length > 0 && (
            <div className="mt-16">
              <div className="glass-card p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-playfair font-semibold text-black mb-4">
                      Finding Your Perfect Fit
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Most of our bracelets feature adjustable sizing for the perfect fit. 
                      For chain bracelets, we recommend measuring your wrist and adding 
                      1/2 to 1 inch for comfortable movement.
                    </p>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span><strong>Small:</strong> 6.5&quot; - 7&quot; wrist</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span><strong>Medium:</strong> 7&quot; - 7.5&quot; wrist</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span><strong>Large:</strong> 7.5&quot; - 8&quot; wrist</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link 
                        href="/contact" 
                        className="btn-secondary"
                        onClick={() => {
                          analytics.trackEvent('collection_sizing_inquiry_click', {
                            collection_name: 'Bracelets',
                            inquiry_type: 'sizing_help'
                          });
                        }}
                        data-luxury-action="bracelet_sizing_help"
                      >
                        Need Sizing Help?
                      </Link>
                    </div>
                  </div>
                  
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                      <p className="text-sm">Sizing Guide Illustration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bracelet Care Section */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-playfair font-semibold text-black mb-6 text-center">
              Caring for Your Bracelet
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-black mb-3">Daily Care</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Remove before swimming or exercising
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Store in individual pouches to prevent scratching
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Avoid contact with lotions and perfumes
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-3">Cleaning</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Use a soft microfiber cloth for gentle cleaning
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    For deeper cleaning, use warm soapy water
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Dry completely before storing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Style Inspiration */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-playfair font-semibold text-black mb-6 text-center">
              Style Inspiration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black mb-2">Solo Statement</h4>
                <p className="text-sm text-gray-600">One bold piece as the focal point</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black mb-2">Stacked Style</h4>
                <p className="text-sm text-gray-600">Multiple thin bracelets for texture</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black mb-2">Mixed Metals</h4>
                <p className="text-sm text-gray-600">Combining different finishes beautifully</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">Perfect Fit Guarantee</h3>
                <p className="text-sm text-gray-600">Adjustable sizing on most pieces</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">Durable Construction</h3>
                <p className="text-sm text-gray-600">Built to last with quality materials</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">Gift Packaging</h3>
                <p className="text-sm text-gray-600">Beautiful presentation included</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}