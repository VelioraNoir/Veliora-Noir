// src/app/collections/necklaces/page.tsx - REPLACE ENTIRE FILE
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
    <main className="relative bg-white min-h-screen pt-28">
      {/* Hero Section */}
      <section className="px-8 pb-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-playfair font-bold tracking-tight text-black mb-6">
            Necklaces
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Elegant chains and pendants that grace the neckline with 
            timeless beauty and contemporary appeal.
          </p>
          
          {/* Collection Stats */}
          {products.length > 0 && (
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mt-6">
              <span>{products.length} piece{products.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>Premium chains</span>
              <span>•</span>
              <span>Luxury pendants</span>
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
                  Our necklace collection features sophisticated designs 
                  crafted from the finest metallic materials.
                </p>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    analytics.trackEvent('collection_notify_me_click', {
                      collection_name: 'Necklaces',
                      user_intent: 'future_purchase_interest'
                    });
                  }}
                  data-luxury-action="notify_me_necklaces"
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
                    data-luxury-action="necklace_product_click"
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
                          data-luxury-action="necklace_quick_add"
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
                      data-luxury-action="necklace_view_details"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Collection Info */}
          {products.length > 0 && (
            <div className="mt-16">
              <div className="glass-card p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-playfair font-semibold text-black mb-4">
                      The Art of Necklace Design
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Our necklace collection celebrates the delicate balance between 
                      bold statement pieces and subtle everyday elegance. Each design 
                      is carefully curated to complement your personal style.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        href="/about" 
                        className="btn-secondary"
                        onClick={() => {
                          analytics.trackEvent('collection_learn_more_click', {
                            collection_name: 'Necklaces',
                            destination: 'about_page'
                          });
                        }}
                        data-luxury-action="necklace_learn_more"
                      >
                        Learn More
                      </Link>
                      <Link 
                        href="/contact" 
                        className="btn-primary"
                        onClick={() => {
                          analytics.trackEvent('collection_contact_click', {
                            collection_name: 'Necklaces',
                            user_intent: 'custom_inquiry'
                          });
                        }}
                        data-luxury-action="necklace_custom_inquiry"
                      >
                        Custom Inquiry
                      </Link>
                    </div>
                  </div>
                  
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                    {/* Placeholder for necklace styling image */}
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                    <img 
                      src="/images/necklace.png" 
                      alt="Elegant necklace design showcasing our collection"
                      className="w-full h-full object-cover"
                    />
                  </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Style Guide */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-playfair font-semibold text-black mb-6 text-center">
              Styling Your Necklace
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black mb-2">Everyday Elegance</h4>
                <p className="text-sm text-gray-600">Perfect for daily wear with subtle sophistication</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black mb-2">Special Occasions</h4>
                <p className="text-sm text-gray-600">Statement pieces for memorable moments</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-black mb-2">Layering</h4>
                <p className="text-sm text-gray-600">Mix and match for personalized style</p>
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
                <h3 className="font-semibold text-black mb-2">Adjustable Length</h3>
                <p className="text-sm text-gray-600">Many pieces feature adjustable chains</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">Secure Clasps</h3>
                <p className="text-sm text-gray-600">Reliable closures for peace of mind</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">Gift Ready</h3>
                <p className="text-sm text-gray-600">Beautiful packaging included</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}