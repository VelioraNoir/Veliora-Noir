import Client from 'shopify-buy';

// Improved interfaces with better type safety
interface ShopifyImage {
  src: string;
  altText?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

interface ShopifyVariant {
  id: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  title: string;
  available: boolean;
  [key: string]: unknown;
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
  [key: string]: unknown;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: Array<{ src: string; altText?: string; width?: number; height?: number }>;
  variants: Array<{ id: string; price: string; currencyCode: string; title: string; available: boolean }>;
  vendor?: string;
  productType?: string;
  tags: string[];
}

export interface CheckoutLineItem {
  variantId: string;
  quantity: number;
}

const validateEnv = (): { domain: string; token: string } => {
  const domain = process.env.NEXT_PUBLIC_SHOP_DOMAIN;
  const token = process.env.NEXT_PUBLIC_STOREFRONT_TOKEN;
  if (!domain || !token) {
    throw new Error(
      'Missing required environment variables. Please set NEXT_PUBLIC_SHOP_DOMAIN and NEXT_PUBLIC_STOREFRONT_TOKEN in your .env.local file.'
    );
  }
  return { domain, token };
};

const initializeClient = () => {
  try {
    const { domain, token } = validateEnv();
    return Client.buildClient({ domain, storefrontAccessToken: token });
  } catch (error) {
    console.error('Failed to initialize Shopify client:', error);
    return null;
  }
};

export const client = initializeClient();

class ShopifyError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'ShopifyError';
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!client) {
    throw new ShopifyError(
      'Shopify client not initialized. Check your environment variables.'
    );
  }
  try {
    const rawProducts = (await client.product.fetchAll()) as ShopifyProduct[];
    return rawProducts.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description || '',
      images: product.images.map((img) => ({
        src: img.src,
        altText: img.altText,
        width: img.width,
        height: img.height,
      })),
      variants: product.variants.map((variant) => ({
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
    throw new ShopifyError(
      'Shopify client not initialized. Check your environment variables.'
    );
  }
  try {
    const rawProduct = (await client.product.fetch(id)) as ShopifyProduct;
    if (!rawProduct) return null;
    return {
      id: rawProduct.id,
      title: rawProduct.title,
      description: rawProduct.description || '',
      images: rawProduct.images.map((img) => ({
        src: img.src,
        altText: img.altText,
        width: img.width,
        height: img.height,
      })),
      variants: rawProduct.variants.map((variant) => ({
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

export async function createCheckout(lineItems: CheckoutLineItem[]) {
  if (!client) throw new ShopifyError('Shopify client not initialized.');
  try {
    const checkout = await client.checkout.create();
    const checkoutWithItems = await client.checkout.addLineItems(
      checkout.id,
      lineItems
    );
    return {
      id: checkoutWithItems.id,
      webUrl: checkoutWithItems.webUrl,
      subtotalPrice: checkoutWithItems.subtotalPrice,
      totalPrice: checkoutWithItems.totalPrice,
      lineItems: checkoutWithItems.lineItems,
    };
  } catch (error) {
    console.error('❌ Checkout creation failed:', error);
    const domain = process.env.NEXT_PUBLIC_SHOP_DOMAIN;
    const cartItems = lineItems
      .map((item) => `${item.variantId}:${item.quantity}`)
      .join(',');
    const cartUrl = `https://${domain}/cart/${cartItems}`;
    return { id: 'direct-cart', webUrl: cartUrl, subtotalPrice: { amount: '0', currencyCode: 'USD' }, totalPrice: { amount: '0', currencyCode: 'USD' }, lineItems: [] };
  }
}

export const mockProducts: Product[] = [/* ... */];

export async function getAllProductsWithFallback(): Promise<Product[]> {
  try {
    return await getAllProducts();
  } catch {
    return mockProducts;
  }
}
