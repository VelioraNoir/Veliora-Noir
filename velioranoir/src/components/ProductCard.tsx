// src/components/ProductCard.tsx
import Image from 'next/image';
import { Product } from '../types/shopify';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export default function ProductCard({ 
  product, 
  priority = false, 
  className = "" 
}: ProductCardProps) {
  const mainImage = product.images[0];
  const price = product.variants[0]?.price || product.priceRange.min;
  const isAvailable = product.available && product.variants.some(v => v.available);

  return (
    <div className={`product-card rounded-2xl overflow-hidden group ${className}`}>
      <div className="product-card-image aspect-square relative">
        {mainImage ? (
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-metallic-platinum-200 flex items-center justify-center">
            <span className="text-metallic-charcoal-400">No Image</span>
          </div>
        )}
        
        {/* Metallic overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-metallic-silver-200/0 to-metallic-gold-200/0 group-hover:from-metallic-silver-200/20 group-hover:to-metallic-gold-200/20 transition-all duration-500" />
        
        {/* Quick view button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="btn-metallic-gold text-sm px-6 py-3">
            Quick View
          </button>
        </div>

        {/* Availability badge */}
        {!isAvailable && (
          <div className="absolute top-4 left-4 bg-metallic-charcoal-800/90 text-white px-3 py-1 rounded-full text-xs font-medium">
            Sold Out
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-playfair text-lg font-medium text-metallic-charcoal-800 dark:text-metallic-platinum-200 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        {product.vendor && (
          <p className="text-sm text-metallic-charcoal-500 mb-2">{product.vendor}</p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-semibold text-metallic-gold-500">
            ${parseFloat(price).toFixed(2)}
          </p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className="w-4 h-4 text-metallic-gold-400" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        
        <button 
          className={`w-full px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            isAvailable
              ? 'bg-gradient-to-r from-metallic-silver-100 to-metallic-platinum-100 hover:from-metallic-silver-200 hover:to-metallic-platinum-200 text-metallic-charcoal-800'
              : 'bg-metallic-charcoal-200 text-metallic-charcoal-500 cursor-not-allowed'
          }`}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}