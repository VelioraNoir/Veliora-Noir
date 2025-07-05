// src/app/collections/rings/page.tsx - REPLACE ENTIRE FILE
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
    <main className="relative bg-white min-h-screen pt-28">
      {/* Hero Section */}
      <section className="px-8 pb-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-playfair font-bold tracking-tight text-black mb-6">
            Rings
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            From minimalist bands to statement pieces, our ring collection 
            embodies sophistication in every curve and finish.
          </p>
          
          {/* Collection Stats */}
          {products.length > 0 && (
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mt-6">
              <span>{products.length} piece{products.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>Premium materials</span>
              <span>•</span>
              <span>Luxury packaging</span>
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
                  Our exquisite ring collection is being carefully curated. 
                  Stay tuned for the launch of our finest pieces.
                </p>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    analytics.trackEvent('collection_notify_me_click', {
                      collection_name: 'Rings',
                      user_intent: 'future_purchase_interest'
                    });
                  }}
                  data-luxury-action="notify_me_rings"
                >
                  Notify Me
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div key={product.id} className="product-card rounded-2xl overflow-hidden group h-full flex flex-col">
                  <Link 
                    href={`/products/${encodeURIComponent(product.id)}`}
                    onClick={() => handleProductClick(product)}
                    className="block"
                    data-luxury-action="ring_product_click"
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
                          data-luxury-action="ring_quick_add"
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
                      data-luxury-action="ring_view_details"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More / Filter Options */}
          {products.length > 0 && (
            <div className="mt-16 text-center">
              <div className="glass-card p-8 inline-block">
                <h3 className="text-xl font-playfair font-semibold text-black mb-4">
                  Looking for something specific?
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact" 
                    className="btn-secondary"
                    onClick={() => {
                      analytics.trackEvent('collection_contact_click', {
                        collection_name: 'Rings',
                        user_intent: 'custom_inquiry'
                      });
                    }}
                    data-luxury-action="ring_custom_inquiry"
                  >
                    Custom Inquiry
                  </Link>
                  <Link 
                    href="/collections" 
                    className="btn-primary"
                    onClick={() => {
                      analytics.trackEvent('collection_browse_all_click', {
                        source_collection: 'Rings'
                      });
                    }}
                    data-luxury-action="browse_all_collections"
                  >
                    Browse All Collections
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">Quality Guarantee</h3>
                <p className="text-sm text-gray-600">Every ring meets our premium standards</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">Secure Shipping</h3>
                <p className="text-sm text-gray-600">Insured delivery with tracking</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">30-Day Returns</h3>
                <p className="text-sm text-gray-600">Hassle-free return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}