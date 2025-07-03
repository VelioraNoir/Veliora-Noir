// src/app/page.tsx
'use client';

import Image from 'next/image';
import { Suspense, useState, useEffect } from 'react';
import { getAllProductsWithFallback, Product } from '../lib/shopify';
import { ProductCardSkeleton, ErrorMessage } from '../components/ui/LoadingComponents';
import Advanced3DViewer from '../components/3d/Advanced3DScene';
import CartDrawer from '../components/cart/CartDrawer';
import { useCartStore } from '../store/cartStore';

// Enhanced Product Card with Cart Integration
const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const [selectedMaterial, setSelectedMaterial] = useState('Silver');
  const [isMounted, setIsMounted] = useState(false);
  const { addItem } = useCartStore();
  
  const mainImage = product.images[0];
  const mainVariant = product.variants[0];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = (material?: string) => {
    if (mainVariant && isMounted) {
      console.log('Adding to cart:', product.title, mainVariant.available); // Debug log
      addItem(product, mainVariant.id, material || selectedMaterial);
    }
  };

  // Debug log to see product data
  console.log('Product:', product.title, 'Available:', mainVariant?.available);

  return (
    <div 
      className="product-card rounded-2xl overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="product-card-image aspect-square relative group">
        <Image
          src={mainImage?.src || '/placeholder-product.jpg'}
          alt={mainImage?.altText || product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={index < 4}
        />
        
        {/* Simple overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* Single Add to Cart button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => handleAddToCart()}
            className={`btn-primary text-sm ${!mainVariant?.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!mainVariant?.available}
          >
            {mainVariant?.available ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>

        {/* Availability badge only - show if sold out */}
        {!mainVariant?.available && (
          <div className="absolute top-4 left-4 bg-red-600/80 text-white px-3 py-1 rounded-full text-sm">
            Sold Out
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-medium text-black mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        {/* Product type and vendor */}
        {product.productType && (
          <p className="text-sm text-gray-500 mb-3">
            {product.productType} {product.vendor && `• ${product.vendor}`}
          </p>
        )}

        {/* Material Selector */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Material:</p>
          <div className="flex gap-2">
            {['Silver', 'Gold', 'Platinum'].map((material) => (
              <button
                key={material}
                onClick={() => setSelectedMaterial(material)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  selectedMaterial === material 
                    ? 'border-black scale-110' 
                    : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: material === 'Gold' ? '#d4af37' : 
                                 material === 'Platinum' ? '#E5E4E2' : '#C0C0C0'
                }}
                title={material}
              />
            ))}
          </div>
        </div>
        
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
        
        <button 
          onClick={() => handleAddToCart(selectedMaterial)}
          className={`w-full mt-4 btn-secondary ${!mainVariant?.available ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!mainVariant?.available}
        >
          {mainVariant?.available ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
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
              <button className="btn-primary">
                Explore Collection
              </button>
              <button className="btn-secondary">
                Our Story
              </button>
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
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
              <button className="btn-secondary">
                View All Accessories
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-12 text-center">
              <h3 className="text-3xl font-semibold tracking-tight text-black mb-4">
                Stay In Touch
              </h3>
              <p className="text-gray-600 mb-8">
                Be the first to know about new collections and exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500 transition-all duration-200"
                />
                <button className="btn-gold whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}