// src/app/collections/page.tsx - LUXURY REVAMP
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { analytics } from '../../lib/analytics';
import NewsletterSignup from '../../components/ui/NewsletterSignup';

export default function Collections() {
  const collections = [
    {
      name: 'Rings',
      href: '/collections/rings',
      description: 'From elegant engagement rings to timeless wedding bands',
      image: '/images/ring.png',
      featured: 'Bestseller',
      startingPrice: '$19.99',
      pieces: '15+ designs'
    },
    {
      name: 'Necklaces', 
      href: '/collections/necklaces',
      description: 'Sophisticated chains and statement pendants',
      image: '/images/necklace.png',
      featured: 'New Arrivals',
      startingPrice: '$27.99',
      pieces: '20+ designs'
    },
    {
      name: 'Bracelets',
      href: '/collections/bracelets', 
      description: 'Refined wrist accessories in premium materials',
      image: '/images/bracelet.png',
      featured: 'Limited Edition',
      startingPrice: '$39.99',
      pieces: '12+ designs'
    },
    {
      name: 'Earrings',
      href: '/collections/earrings',
      description: 'Elegant studs, drops, and statement pieces',
      image: '/images/earring.png',
      featured: 'Trending',
      startingPrice: '$71.99',
      pieces: '18+ designs'
    }
  ];

  const handleCollectionClick = (collectionName: string) => {
    analytics.trackEvent('collection_navigation', {
      collection_name: collectionName,
      source_page: 'collections_overview',
      user_intent: 'browse_collection'
    });
  };

  return (
    <main className="relative bg-white min-h-screen">
      {/* Ultra-Luxury Hero Section */}
      <section className="relative py-24 px-8 overflow-hidden">
        {/* Elegant background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-amber-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-gray-200/20 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Exclusive Badge */}
          <div className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm rounded-full px-6 py-3 text-sm text-gray-700 animate-fade-in-up mb-8">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Curated Luxury Collections • Premium Quality</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-7xl lg:text-8xl font-light tracking-tight text-black mb-4 animate-fade-in-up delay-100">
              <span className="block font-serif italic text-4xl lg:text-5xl text-gray-600 mb-2">Discover Our</span>
              <span className="font-semibold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Collections</span>
            </h1>
            
            <div className="w-24 h-px bg-gradient-to-r from-black to-transparent mx-auto animate-fade-in-up delay-200" />
            
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed animate-fade-in-up delay-300 max-w-3xl mx-auto">
              Explore our meticulously curated selection of <em className="text-black font-medium">luxury jewelry</em>, 
              where each piece represents the perfect harmony of <em className="text-black font-medium">timeless elegance</em> and modern sophistication.
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 animate-fade-in-up delay-500 mt-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-amber-600">✨</span>
                  </div>
                ))}
              </div>
              <span className="font-medium">75,000+ pieces sold worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium">4.9/5 stars (12,847 reviews)</span>
            </div>
          </div>
          
          {/* Security Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-700 mt-6">
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-full px-4 py-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">SSL Secured Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-full px-4 py-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-medium">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 rounded-full px-4 py-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-medium">Fast Shipping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Collections Grid */}
      <section className="px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <Link 
                key={collection.name}
                href={collection.href}
                onClick={() => handleCollectionClick(collection.name)}
                className="group block"
              >
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={`${collection.name} collection showcase`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    
                    {/* Premium overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                    
                    {/* Collection badges */}
                    <div className="absolute top-6 left-6">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        collection.featured === 'Bestseller' ? 'bg-yellow-500 text-black' :
                        collection.featured === 'New Arrivals' ? 'bg-green-500 text-white' :
                        collection.featured === 'Limited Edition' ? 'bg-purple-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {collection.featured}
                      </div>
                    </div>
                    
                    {/* Pricing badge */}
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl">
                      <div className="text-xs text-gray-600">Starting from</div>
                      <div className="text-sm font-bold text-black">{collection.startingPrice}</div>
                    </div>
                    
                    {/* Hover CTA */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/95 backdrop-blur-sm text-black px-8 py-4 rounded-xl font-medium shadow-xl transform hover:scale-105 transition-transform duration-200">
                        <div className="flex items-center gap-2">
                          <span>Explore Collection</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-3xl font-semibold tracking-tight text-black group-hover:text-gray-800 transition-colors">
                        {collection.name}
                      </h2>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {collection.pieces}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">
                      {collection.description}
                    </p>
                    
                    {/* Collection features */}
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-6">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Premium materials</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Handcrafted quality</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>20% OFF Sale</span>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-black">
                        From {collection.startingPrice}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 group-hover:text-black transition-colors">
                        <span className="font-medium">Shop Now</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold mb-4">Why Choose Veliora Noir?</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experience the difference that comes with uncompromising quality and exceptional craftsmanship
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Premium Quality",
                  description: "Ethically sourced materials and expert craftsmanship",
                  icon: (
                    <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )
                },
                {
                  title: "Secure Shopping",
                  description: "SSL encryption and trusted payment methods",
                  icon: (
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )
                },
                {
                  title: "Fast Shipping",
                  description: "Quick delivery with secure packaging",
                  icon: (
                    <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )
                },
                {
                  title: "Easy Returns",
                  description: "30-day hassle-free return policy",
                  icon: (
                    <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/collections/rings"
                className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 inline-block"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup source="collections_page" />
        </div>
      </section>
    </main>
  );
}