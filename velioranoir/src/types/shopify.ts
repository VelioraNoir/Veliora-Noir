// src/types/shopify.ts

// Enhanced Shopify SDK types
export interface ShopifyImage {
  id: string;
  src: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  price: ShopifyPrice;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  title: string;
  quantityAvailable?: number;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  tags: string[];
  productType: string;
  vendor: string;
  availableForSale: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
}

// Our clean product interface for the frontend
export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  variants: Array<{
    id: string;
    price: string;
    available: boolean;
    title: string;
  }>;
  tags: string[];
  vendor: string;
  available: boolean;
  priceRange: {
    min: string;
    max: string;
  };
}

// API Response types
export interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
}

// Error types
export class ShopifyError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ShopifyError';
  }
}