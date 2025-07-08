// src/components/ui/RelatedProducts.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProductsWithFallback, Product } from '../../lib/shopify';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { analytics } from '../../lib/analytics';

interface RelatedProductsProps {
  currentProduct: Product;
  maxItems?: number;
}

export default function RelatedProducts({ currentProduct, maxItems = 4 }: RelatedProductsProps) {
  // ─── Destructure for precise deps ─────────────────────────────────────
  const { id, productType, vendor, tags } = currentProduct;

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProductsWithFallback();

        // Exclude current product
        const otherProducts = allProducts.filter(p => p.id !== id);

        // Score based on shared attributes
        const related = otherProducts
          .map(product => {
            let score = 0;
            if (product.productType === productType) score += 10;
            if (product.vendor === vendor) score += 5;
            const sharedTags = product.tags.filter(tag => tags.includes(tag));
            score += sharedTags.length * 2;
            return { product, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, maxItems)
          .map(item => item.product);

        setRelatedProducts(related);

        analytics.trackEvent('related_products_view', {
          current_product_id: id,
          related_count: related.length,
          recommendations_shown: true
        });
      } catch (error) {
        console.error('Error loading related products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
  // ─── Now listing exactly the destructured values ─────────────────────────
  }, [id, productType, vendor, tags, maxItems]);

  const handleAddToCart = (product: Product) => {
    const mainVariant = product.variants[0];
    if (mainVariant?.available) {
      addToCart(product, mainVariant.id);
      analytics.trackEvent('related_product_add_to_cart', {
        source_product_id: id,
        target_product_id: product.id,
        target_product_name: product.title,
        conversion_source: 'related_products'
      });
    }
  };

  const handleWishlistToggle = (product: Product) => {
    if (!isMounted) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleProductClick = (product: Product) => {
    analytics.trackEvent('related_product_click', {
      source_product_id: id,
      target_product_id: product.id,
      target_product_name: product.title,
      position: relatedProducts.findIndex(p => p.id === product.id) + 1
    });
  };

  if (loading || relatedProducts.length === 0) return null;

  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-black mb-4">
            You Might Also Like
          </h2>
          <p className="text-gray-600">
            Discover more beautiful pieces from our collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map(product => {
            const mainVariant = product.variants[0];
            const mainImage = product.images[0];

            return (
              <div key={product.id} className="product-card rounded-2xl overflow-hidden group h-full flex flex-col">
                <Link
                  href={`/products/${encodeURIComponent(product.id)}`}
                  onClick={() => handleProductClick(product)}
                  className="block"
                >
                  <div className="product-card-image aspect-square relative">
                    <Image
                      src={mainImage?.src || '/placeholder-product.jpg'}
                      alt={mainImage?.altText || product.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    <button
                      onClick={e => {
                        e.preventDefault(); e.stopPropagation();
                        handleWishlistToggle(product);
                      }}
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                        isMounted && isInWishlist(product.id)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200'
                      }`}
                      title={isMounted && isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <svg
                        className="w-4 h-4"
                        fill={isMounted && isInWishlist(product.id) ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={e => {
                          e.preventDefault(); e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="btn-primary text-sm"
                        disabled={!mainVariant?.available}
                      >
                        {mainVariant?.available ? 'Quick Add' : 'Sold Out'}
                      </button>
                    </div>

                    {!mainVariant?.available && (
                      <div className="absolute top-4 left-4 bg-red-600/80 text-white px-3 py-1 rounded-full text-sm">
                        Sold Out
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-black mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    {product.productType && (
                      <p className="text-sm text-gray-500 mb-3">{product.productType}</p>
                    )}
                    <p className="text-2xl font-semibold text-black mb-4">
                      ${mainVariant?.price}
                    </p>
                  </div>
                  <Link
                    href={`/products/${encodeURIComponent(product.id)}`}
                    onClick={() => handleProductClick(product)}
                    className="w-full btn-secondary block text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
