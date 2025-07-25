// src/app/products/[id]/page.tsx - IMPROVED VERSION
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProduct, Product } from '../../../lib/shopify';
import { useCartStore } from '../../../store/cartStore';
import { useWishlistStore } from '../../../store/wishlistStore';
import { ProductCardSkeleton, ErrorMessage } from '../../../components/ui/LoadingComponents';
import { analytics } from '../../../lib/analytics';
import RelatedProducts from '../../../components/ui/RelatedProducts';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  // Decode the product ID from URL
  const productId = decodeURIComponent(params.id as string);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading product with ID:', productId);
        
        const fetchedProduct = await getProduct(productId);
        
        if (!fetchedProduct) {
          setError('Product not found');
          return;
        }
        
        setProduct(fetchedProduct);
        
        // Set default variant
        if (fetchedProduct.variants.length > 0) {
          setSelectedVariant(fetchedProduct.variants[0].id);
        }
        
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
        
        // TRACK PRODUCT LOAD ERROR
        analytics.trackEvent('product_load_error', {
          product_id: productId,
          error_message: err instanceof Error ? err.message : 'unknown_error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // TRACK PRODUCT VIEW when product loads
  useEffect(() => {
    if (product) {
      const selectedVariantData = product.variants.find(v => v.id === selectedVariant);
      
      // Track product view
      analytics.productView(
        product.id,
        product.title,
        selectedVariantData?.price || '0',
        product.productType || 'Jewelry'
      );
      
      // Track page view
      analytics.pageView(`Product: ${product.title}`, 'product');
    }
  }, [product, selectedVariant]);

  // TRACK QUANTITY CHANGES
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    
    if (newQuantity > 1) {
      analytics.trackEvent('product_quantity_increase', {
        product_id: product?.id || '',
        quantity: newQuantity,
        customer_intent: 'high_value'
      });
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const variant = product.variants.find(v => v.id === selectedVariant);
    if (!variant?.available) return;

    // Add to cart with quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedVariant);
    }
    
    // TRACK ADD TO CART EVENT
    analytics.addToCart(
      product.id,
      product.title,
      variant.price,
      quantity
    );
    
    // TRACK LUXURY PURCHASE INTENT
    const productValue = parseFloat(variant.price) * quantity;
    if (productValue > 200) {
      analytics.trackEvent('high_value_add_to_cart', {
        product_id: product.id,
        product_name: product.title,
        value: productValue,
        currency: 'USD',
        customer_segment: 'luxury'
      });
    }
    
    // Show luxury feedback
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 3000);
  };

  // HANDLE WISHLIST TOGGLE
  const handleWishlistToggle = () => {
    if (!product || !isMounted) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      
      analytics.trackEvent('remove_from_wishlist', {
        product_id: product.id,
        product_name: product.title,
        price: selectedVariantData?.price || '0',
        source: 'product_page'
      });
    } else {
      addToWishlist(product);
      
      analytics.trackEvent('add_to_wishlist', {
        product_id: product.id,
        product_name: product.title,
        price: selectedVariantData?.price || '0',
        customer_intent: 'future_purchase',
        source: 'product_page'
      });
    }
  };

  // TRACK IMAGE VIEWING
  const handleImageChange = (index: number) => {
    setSelectedImageIndex(index);
    
    analytics.trackEvent('product_image_view', {
      product_id: product?.id || '',
      image_index: index,
      total_images: product?.images.length || 0,
      engagement_level: 'detailed_browsing'
    });
  };

  const selectedVariantData = product?.variants.find(v => v.id === selectedVariant);
  const isAvailable = selectedVariantData?.available ?? false;
  const price = selectedVariantData?.price ?? '0';

  if (loading) {
    return (
      <main className="relative bg-white min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="relative bg-white min-h-screen pt-20 flex items-center justify-center">
        <ErrorMessage 
          title="Product not found"
          message={error || 'The product you\'re looking for doesn\'t exist.'}
          retry={() => router.back()}
        />
      </main>
    );
  }

  return (
    <>
      <main className="relative bg-white min-h-screen pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link 
              href="/" 
              className="hover:text-gray-700"
              onClick={() => analytics.trackEvent('breadcrumb_click', { destination: 'home' })}
            >
              Home
            </Link>
            <span>/</span>
            <Link 
              href="/collections" 
              className="hover:text-gray-700"
              onClick={() => analytics.trackEvent('breadcrumb_click', { destination: 'collections' })}
            >
              Collections
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-100">
                {product.images[selectedImageIndex] ? (
                  <Image
                    src={product.images[selectedImageIndex].src}
                    alt={product.images[selectedImageIndex].altText || product.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                        selectedImageIndex === index 
                          ? 'ring-2 ring-gray-900 scale-105' 
                          : 'hover:opacity-75'
                      }`}
                      data-luxury-action="product_image_thumbnail"
                    >
                      <Image
                        src={image.src}
                        alt={image.altText || `${product.title} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Title and Price */}
              <div>
                <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  {/* Original price crossed out */}
                  <span className="text-2xl font-medium text-gray-400 line-through">
                    ${parseFloat(price).toFixed(2)}
                  </span>
                  {/* Discounted price (20% off) */}
                  <span className="text-3xl font-semibold text-gray-900">
                    ${(parseFloat(price) * 0.8).toFixed(2)}
                  </span>
                  {!isAvailable && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                      Sold Out
                    </span>
                  )}
                </div>
                
                {/* Product Type and Vendor */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {product.productType && <span>{product.productType}</span>}
                  {product.vendor && (
                    <>
                      <span>•</span>
                      <span>{product.vendor}</span>
                    </>
                  )}
                </div>

                {/* Rating Stars (placeholder) */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.9 out of 5)</span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700 font-medium"
                    data-luxury-action="quantity_decrease"
                  >
                    -
                  </button>
                  <span className="font-medium w-8 text-center text-gray-900">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700 font-medium"
                    data-luxury-action="quantity_increase"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart and Wishlist */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`w-full py-4 rounded-full font-medium text-lg transition-all duration-200 ${
                    !isAvailable
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-[1.02]'
                  }`}
                  data-luxury-action="add_to_cart_main"
                >
                  {!isAvailable ? 'Sold Out' : 'Add to Cart'}
                </button>

                {/* Working Wishlist Button */}
                <button 
                  onClick={handleWishlistToggle}
                  className={`w-full py-3 border rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    isMounted && isInWishlist(product.id)
                      ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  data-luxury-action="wishlist_toggle"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill={isMounted && isInWishlist(product.id) ? "currentColor" : "none"} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isMounted && isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-sm text-gray-600">Secure Checkout</p>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <p className="text-sm text-gray-600">Fast Shipping</p>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <p className="text-sm text-gray-600">30-Day Returns</p>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4 pt-8 border-t border-gray-200">
                <details 
                  className="group"
                  onToggle={(e) => {
                    if ((e.target as HTMLDetailsElement).open) {
                      analytics.trackEvent('product_details_expand', {
                        product_id: product.id,
                        section: 'product_details'
                      });
                    }
                  }}
                >
                  <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900 py-2">
                    Product Details
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 space-y-2">
                    <p>• Handcrafted with premium materials</p>
                    <p>• Hypoallergenic and tarnish-resistant</p>
                    <p>• Includes luxury gift packaging</p>
                    <p>• Certificate of authenticity included</p>
                  </div>
                </details>

                <details 
                  className="group"
                  onToggle={(e) => {
                    if ((e.target as HTMLDetailsElement).open) {
                      analytics.trackEvent('product_details_expand', {
                        product_id: product.id,
                        section: 'shipping_returns'
                      });
                    }
                  }}
                >
                  <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900 py-2">
                    Shipping & Returns
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 space-y-2">
                    <p>• Fast shipping</p>
                    <p>• 30-day return window</p>
                    <p>• Free returns on all orders</p>
                  </div>
                </details>

                <details 
                  className="group"
                  onToggle={(e) => {
                    if ((e.target as HTMLDetailsElement).open) {
                      analytics.trackEvent('product_details_expand', {
                        product_id: product.id,
                        section: 'care_instructions'
                      });
                    }
                  }}
                >
                  <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900 py-2">
                    Care Instructions
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 space-y-2">
                    <p>• Clean with soft microfiber cloth</p>
                    <p>• Store in provided jewelry box</p>
                    <p>• Avoid contact with chemicals and perfume</p>
                    <p>• Remove before swimming or showering</p>
                    <p>• Professional cleaning recommended annually</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product && <RelatedProducts currentProduct={product} />}
      </main>

      {/* Luxury Added to Cart Popup */}
      {showAddedFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 animate-fade-in-up max-w-sm mx-4 pointer-events-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-2">
                Added to Cart
              </h3>
              <p className="text-sm text-gray-600 mb-1">{product.title}</p>
              <p className="text-xs text-gray-500">Quantity: {quantity} • ${(parseFloat(price) * 0.8 * quantity).toFixed(2)}</p>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => setShowAddedFeedback(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
                <button 
                  onClick={() => {
                    setShowAddedFeedback(false);
                    useCartStore.getState().toggleCart();
                  }}
                  className="flex-1 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800"
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}