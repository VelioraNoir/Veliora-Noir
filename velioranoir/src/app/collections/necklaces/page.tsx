// src/app/collections/necklaces/page.tsx - REPLACE ENTIRE FILE
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProductsWithFallback, Product } from '../../../lib/shopify';
import { ProductCardSkeleton, ErrorMessage } from '../../../components/ui/LoadingComponents';
import { useCartStore } from '../../../store/cartStore';

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product: Product, material: string = 'Silver') => {
    const mainVariant = product.variants[0];
    if (mainVariant?.available) {
      addItem(product, mainVariant.id);
    }
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
                <button className="btn-secondary">
                  Notify Me
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div key={product.id} className="product-card rounded-2xl overflow-hidden group h-full flex flex-col">
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
                        onClick={() => handleAddToCart(product)}
                        className="btn-primary text-sm"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                  
                  {/* FIXED: Button alignment */}
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
                      className="w-full btn-secondary block text-center"
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
    </main>
  );
}