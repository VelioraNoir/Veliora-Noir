// src/app/products/[id]/page.tsx - CREATE THIS FILE (make sure directory structure is correct)
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProduct, Product } from '../../../lib/shopify';
import { useCartStore } from '../../../store/cartStore';
import { ProductCardSkeleton, ErrorMessage } from '../../../components/ui/LoadingComponents';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState('Silver');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const { addItem } = useCartStore();

  // Decode the product ID from URL
  const productId = decodeURIComponent(params.id as string);

  const materials = [
    { name: 'Silver', color: '#C0C0C0' },
    { name: 'Gold', color: '#FFD700' },
    { name: 'Platinum', color: '#E5E4E2' },
    { name: 'Copper', color: '#B87333' },
  ];

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading product with ID:', productId); // Debug log
        
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
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const variant = product.variants.find(v => v.id === selectedVariant);
    if (!variant?.available) return;

    addItem(product, selectedVariant, selectedMaterial);
    
    // Show luxury feedback
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 3000);
  };

  const selectedVariantData = product?.variants.find(v => v.id === selectedVariant);
  const isAvailable = selectedVariantData?.available ?? false;
  const price = selectedVariantData?.price ?? '0';

  if (loading) {
    return (
      <main className="relative bg-white min-h-screen pt-8">
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
      <main className="relative bg-white min-h-screen pt-8 flex items-center justify-center">
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
      <main className="relative bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-gray-700">Collections</Link>
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
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                        selectedImageIndex === index 
                          ? 'ring-2 ring-gray-900' 
                          : 'hover:opacity-75'
                      }`}
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
                  <span className="text-3xl font-semibold text-gray-900">
                    ${parseFloat(price).toFixed(2)}
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

              {/* Material Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Material</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {materials.map((material) => (
                    <button
                      key={material.name}
                      onClick={() => setSelectedMaterial(material.name)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                        selectedMaterial === material.name
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: material.color }}
                      />
                      <span className="text-sm font-medium">{material.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`w-full py-4 rounded-full font-medium text-lg transition-all duration-200 ${
                    !isAvailable
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {!isAvailable ? 'Sold Out' : 'Add to Cart'}
                </button>

                {/* Additional Actions */}
                <div className="flex gap-4">
                  <button className="flex-1 py-3 border border-gray-300 rounded-full font-medium hover:bg-gray-50">
                    Add to Wishlist
                  </button>
                  <button className="flex-1 py-3 border border-gray-300 rounded-full font-medium hover:bg-gray-50">
                    Share
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4 pt-8 border-t border-gray-200">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900">
                    Product Details
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 space-y-2">
                    <p>• Handcrafted with premium materials</p>
                    <p>• Available in multiple finishes</p>
                    <p>• Includes luxury gift packaging</p>
                    <p>• 30-day return policy</p>
                  </div>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900">
                    Shipping & Returns
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 space-y-2">
                    <p>• Free shipping on orders over $200</p>
                    <p>• 2-3 business days processing</p>
                    <p>• 5-7 business days shipping</p>
                    <p>• 30-day return window</p>
                  </div>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900">
                    Care Instructions
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 space-y-2">
                    <p>• Clean with soft microfiber cloth</p>
                    <p>• Store in provided jewelry box</p>
                    <p>• Avoid contact with chemicals</p>
                    <p>• Professional cleaning recommended</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Luxury Added to Cart Popup */}
      {showAddedFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 animate-fade-in-up max-w-sm mx-4">
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
              <p className="text-xs text-gray-500">{selectedMaterial} • ${price}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}