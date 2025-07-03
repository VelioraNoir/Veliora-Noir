// src/lib/shopify.ts
import Client from 'shopify-buy';

// Improved interfaces with better type safety
interface ShopifyImage {
  src: string;
  altText?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

interface ShopifyVariant {
  id: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  title: string;
  available: boolean;
  [key: string]: any;
}

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  vendor?: string;
  productType?: string;
  tags: string[];
  [key: string]: any;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: Array<{
    src: string;
    altText?: string;
    width?: number;
    height?: number;
  }>;
  variants: Array<{
    id: string;
    price: string;
    currencyCode: string;
    title: string;
    available: boolean;
  }>;
  vendor?: string;
  productType?: string;
  tags: string[];
}

// Validate environment variables
const validateEnv = () => {
  const domain = process.env.NEXT_PUBLIC_SHOP_DOMAIN;
  const token = process.env.NEXT_PUBLIC_STOREFRONT_TOKEN;
  
  if (!domain || !token) {
    throw new Error(
      'Missing required environment variables. Please set NEXT_PUBLIC_SHOP_DOMAIN and NEXT_PUBLIC_STOREFRONT_TOKEN in your .env.local file.'
    );
  }
  
  return { domain, token };
};

// Initialize client with error handling
const initializeClient = () => {
  try {
    const { domain, token } = validateEnv();
    
    return Client.buildClient({
      domain,
      storefrontAccessToken: token,
    });
  } catch (error) {
    console.error('Failed to initialize Shopify client:', error);
    // Return null client for graceful degradation
    return null;
  }
};

export const client = initializeClient();

// Error handling for API calls
class ShopifyError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'ShopifyError';
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!client) {
    throw new ShopifyError('Shopify client not initialized. Check your environment variables.');
  }

  try {
    const rawProducts = await client.product.fetchAll() as ShopifyProduct[];
    
    return rawProducts.map((product: ShopifyProduct) => ({
      id: product.id,
      title: product.title,
      description: product.description || '',
      images: product.images.map((img: ShopifyImage) => ({
        src: img.src,
        altText: img.altText,
        width: img.width,
        height: img.height,
      })),
      variants: product.variants.map((variant: ShopifyVariant) => ({
        id: variant.id,
        price: variant.price.amount,
        currencyCode: variant.price.currencyCode,
        title: variant.title,
        available: variant.available,
      })),
      vendor: product.vendor,
      productType: product.productType,
      tags: product.tags || [],
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new ShopifyError('Failed to fetch products from Shopify', error as Error);
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!client) {
    throw new ShopifyError('Shopify client not initialized. Check your environment variables.');
  }

  try {
    const rawProduct = await client.product.fetch(id) as ShopifyProduct;
    
    if (!rawProduct) return null;

    return {
      id: rawProduct.id,
      title: rawProduct.title,
      description: rawProduct.description || '',
      images: rawProduct.images.map((img: ShopifyImage) => ({
        src: img.src,
        altText: img.altText,
        width: img.width,
        height: img.height,
      })),
      variants: rawProduct.variants.map((variant: ShopifyVariant) => ({
        id: variant.id,
        price: variant.price.amount,
        currencyCode: variant.price.currencyCode,
        title: variant.title,
        available: variant.available,
      })),
      vendor: rawProduct.vendor,
      productType: rawProduct.productType,
      tags: rawProduct.tags || [],
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new ShopifyError(`Failed to fetch product ${id}`, error as Error);
  }
}

// Mock data for development/fallback
export const mockProducts: Product[] = [
  {
    id: 'mock-1',
    title: 'Platinum Sterling Necklace',
    description: 'Elegant platinum-plated sterling silver necklace with sophisticated metallic finish.',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center',
        altText: 'Platinum Sterling Necklace',
        width: 600,
        height: 600,
      }
    ],
    variants: [
      {
        id: 'mock-variant-1',
        price: '299.00',
        currencyCode: 'USD',
        title: 'Default',
        available: true,
      }
    ],
    vendor: 'Veliora Noir',
    productType: 'Necklace',
    tags: ['platinum', 'sterling', 'luxury'],
  },
  {
    id: 'mock-2',
    title: 'Gold Accent Bracelet',
    description: 'Handcrafted gold accent bracelet with intricate metallic detailing.',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&crop=center',
        altText: 'Gold Accent Bracelet',
        width: 600,
        height: 600,
      }
    ],
    variants: [
      {
        id: 'mock-variant-2',
        price: '189.00',
        currencyCode: 'USD',
        title: 'Default',
        available: true,
      }
    ],
    vendor: 'Veliora Noir',
    productType: 'Bracelet',
    tags: ['gold', 'handcrafted', 'luxury'],
  },
  {
    id: 'mock-3',
    title: 'Silver Minimalist Ring',
    description: 'Modern minimalist silver ring with brushed metallic finish.',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center',
        altText: 'Silver Minimalist Ring',
        width: 600,
        height: 600,
      }
    ],
    variants: [
      {
        id: 'mock-variant-3',
        price: '129.00',
        currencyCode: 'USD',
        title: 'Default',
        available: true,
      }
    ],
    vendor: 'Veliora Noir',
    productType: 'Ring',
    tags: ['silver', 'minimalist', 'modern'],
  },
  {
    id: 'mock-4',
    title: 'Copper Statement Earrings',
    description: 'Bold copper statement earrings with geometric metallic design.',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&crop=center',
        altText: 'Copper Statement Earrings',
        width: 600,
        height: 600,
      }
    ],
    variants: [
      {
        id: 'mock-variant-4',
        price: '89.00',
        currencyCode: 'USD',
        title: 'Default',
        available: true,
      }
    ],
    vendor: 'Veliora Noir',
    productType: 'Earrings',
    tags: ['copper', 'statement', 'geometric'],
  },
];

// Graceful fallback function
export async function getAllProductsWithFallback(): Promise<Product[]> {
  try {
    console.log('Attempting to connect to Shopify store...');
    const realProducts = await getAllProducts();
    console.log('Successfully loaded', realProducts.length, 'products from Shopify');
    return realProducts;
  } catch (error) {
    console.warn('Using mock data due to Shopify connection issue:', error);
    return mockProducts;
  }
}