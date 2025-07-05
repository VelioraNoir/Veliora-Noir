// src/app/collections/earrings/page.tsx - REPLACE ENTIRE FILE
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProductsWithFallback, Product } from '../../../lib/shopify';
import { ProductCardSkeleton, ErrorMessage } from '../../../components/ui/LoadingComponents';
import { useCartStore } from '../../../store/cartStore';
import { analytics } from '../../../lib/analytics';

export default function Earrings() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProductsWithFallback();
        
        // Filter products by type - earrings only
        const earrings = allProducts.filter(product => 
          product.productType?.toLowerCase() === 'earring' ||
          product.productType?.toLowerCase() === 'earrings' ||
          product.tags.some(tag => tag.toLowerCase().includes('earring'))
        );
        
        setProducts(earrings);
        
        // TRACK COLLECTION VIEW
        analytics.viewCategory('Earrings', earrings.length);
        
        // TRACK PAGE VIEW
        analytics.pageView('Earrings Collection', 'collection');
        
        // Track luxury collection engagement
        analytics.trackEvent('luxury_collection_view', {
          collection_name: 'Earrings',
          products_available: earrings.length,
          collection_type: 'jewelry',
          user_intent: 'product_discovery'
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        
        // Track collection load error
        analytics.trackEvent('collection_load_error', {
          collection_name: 'Earrings',
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
          collection_name: 'Earrings',
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
        collection_name: 'Earrings',
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
      collection_name: 'Earrings',
      product_position: products.findIndex(p => p.id === product.id) + 1,
      total_products: products.length
    });
    
    // Track product view
    analytics.productView(
      product.id,
      product.title,
      product.variants[0]?.price || '0',
      'Earrings'
    );
  };

  if (error) {
    return (
      <main className="relative bg-white min-h-screen pt-28 px-8">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage 
            title="Unable to load earrings"
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
            Earrings
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            From subtle studs to statement drops, our earring collection 
            adds the perfect finishing touch to any ensemble.
          </p>
          
          {/* Collection Stats */}
          {products.length > 0 && (
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mt-6">
              <span>{products.length} piece{products.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>Hypoallergenic posts</span>
              <span>•</span>
              <span>Secure backs included</span>
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
                  Our earring collection features geometric designs and 
                  organic forms in premium metallic finishes.
                </p>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    analytics.trackEvent('collection_notify_me_click', {
                      collection_name: 'Earrings',
                      user_intent: 'future_purchase_interest'
                    });
                  }}
                  data-luxury-action="notify_me_earrings"
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
                    data-luxury-action="earring_product_click"
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
                          data-luxury-action="earring_quick_add"
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
                      data-luxury-action="earring_view_details"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Earring Style Guide */}
          {products.length > 0 && (
            <div className="mt-16">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-playfair font-semibold text-black mb-6 text-center">
                  Find Your Perfect Style
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-black mb-2">Studs</h4>
                    <p className="text-sm text-gray-600">Perfect for everyday elegance</p>
                  </div>
                  
                  <div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-black mb-2">Drops</h4>
                    <p className="text-sm text-gray-600">Graceful movement and sophistication</p>
                  </div>
                  
                  <div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-black mb-2">Hoops</h4>
                    <p className="text-sm text-gray-600">Classic circles in various sizes</p>
                  </div>
                  
                  <div>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-black mb-2">Statement</h4>
                    <p className="text-sm text-gray-600">Bold designs that command attention</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Face Shape Guide */}
      <section className="px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-playfair font-semibold text-black mb-8 text-center">
              Earrings for Your Face Shape
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-16 h-20 bg-pink-300 rounded-full"></div>
                </div>
                <h4 className="font-semibold text-black mb-2">Oval Face</h4>
                <p className="text-sm text-gray-600">Most earring styles work beautifully. Try statement pieces or long drops.</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-20 h-16 bg-blue-300 rounded-lg"></div>
                </div>
                <h4 className="font-semibold text-black mb-2">Round Face</h4>
                <p className="text-sm text-gray-600">Angular shapes and longer drops help elongate your features.</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-16 h-20 bg-green-300" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
                </div>
                <h4 className="font-semibold text-black mb-2">Heart Face</h4>
                <p className="text-sm text-gray-600">Wider bottom styles like teardrops balance your features perfectly.</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-20 h-20 bg-purple-300"></div>
                </div>
                <h4 className="font-semibold text-black mb-2">Square Face</h4>
                <p className="text-sm text-gray-600">Soft, curved designs like hoops complement your strong jawline.</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link 
                href="/contact" 
                className="btn-secondary"
                onClick={() => {
                  analytics.trackEvent('collection_styling_consultation_click', {
                    collection_name: 'Earrings',
                    consultation_type: 'face_shape_styling'
                  });
                }}
                data-luxury-action="earring_styling_consultation"
              >
                Get Styling Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Earring Care */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-playfair font-semibold text-black mb-6 text-center">
              Caring for Your Earrings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Hypoallergenic Materials
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  All our earrings feature hypoallergenic posts and backs, making them safe 
                  for sensitive ears and daily wear.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Nickel-free materials
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Surgical steel posts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Secure backing systems
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  Maintenance Tips
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Keep your earrings looking their best with these simple care instructions.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Clean posts with rubbing alcohol
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Store in individual compartments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Remove before swimming
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">Sensitive Ear Safe</h3>
                <p className="text-sm text-gray-600">Hypoallergenic materials for all skin types</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">Secure Backs</h3>
                <p className="text-sm text-gray-600">Premium backing systems included</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2">Perfect Pairing</h3>
                <p className="text-sm text-gray-600">Sold as matching pairs</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}  