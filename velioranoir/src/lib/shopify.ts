import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Keep existing interfaces for compatibility
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
    return createStorefrontApiClient({
      storeDomain: `https://${domain}`,
      apiVersion: '2025-07',
      publicAccessToken: token,
    });
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

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          vendor
          productType
          tags
          images(first: 10) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      vendor
      productType
      tags
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function getAllProducts(): Promise<Product[]> {
  if (!client) {
    throw new ShopifyError('Shopify client not initialized. Check your environment variables.');
  }

  try {
    const { data, errors } = await client.request(PRODUCTS_QUERY, {
      variables: { first: 100 }
    });

    if (errors) {
      throw new ShopifyError(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    return data.products.edges.map((edge: any) => {
      const product = edge.node;
      return {
        id: product.id,
        title: product.title,
        description: product.description || '',
        images: product.images.edges.map((imgEdge: any) => ({
          src: imgEdge.node.url,
          altText: imgEdge.node.altText,
          width: imgEdge.node.width,
          height: imgEdge.node.height,
        })),
        variants: product.variants.edges.map((variantEdge: any) => ({
          id: variantEdge.node.id,
          price: variantEdge.node.price.amount,
          currencyCode: variantEdge.node.price.currencyCode,
          title: variantEdge.node.title,
          available: variantEdge.node.availableForSale,
        })),
        vendor: product.vendor,
        productType: product.productType,
        tags: product.tags || [],
      };
    });
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
    const { data, errors } = await client.request(PRODUCT_QUERY, {
      variables: { id }
    });

    if (errors) {
      throw new ShopifyError(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    if (!data.product) return null;

    const product = data.product;
    return {
      id: product.id,
      title: product.title,
      description: product.description || '',
      images: product.images.edges.map((imgEdge: any) => ({
        src: imgEdge.node.url,
        altText: imgEdge.node.altText,
        width: imgEdge.node.width,
        height: imgEdge.node.height,
      })),
      variants: product.variants.edges.map((variantEdge: any) => ({
        id: variantEdge.node.id,
        price: variantEdge.node.price.amount,
        currencyCode: variantEdge.node.price.currencyCode,
        title: variantEdge.node.title,
        available: variantEdge.node.availableForSale,
      })),
      vendor: product.vendor,
      productType: product.productType,
      tags: product.tags || [],
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new ShopifyError(`Failed to fetch product ${id}`, error as Error);
  }
}

export async function createCheckout(lineItems: CheckoutLineItem[]) {
  if (!client) throw new ShopifyError('Shopify client not initialized.');

  try {
    const { data, errors } = await client.request(CART_CREATE_MUTATION, {
      variables: {
        input: {
          lines: lineItems.map(item => ({
            merchandiseId: item.variantId,
            quantity: item.quantity
          }))
        }
      }
    });

    if (errors) {
      throw new ShopifyError(`Cart creation failed: ${JSON.stringify(errors)}`);
    }

    if (data.cartCreate.userErrors.length > 0) {
      throw new ShopifyError(`Cart creation failed: ${JSON.stringify(data.cartCreate.userErrors)}`);
    }

    const cart = data.cartCreate.cart;
    return {
      id: cart.id,
      webUrl: cart.checkoutUrl,
      subtotalPrice: {
        amount: cart.cost.subtotalAmount.amount,
        currencyCode: cart.cost.subtotalAmount.currencyCode
      },
      totalPrice: {
        amount: cart.cost.totalAmount.amount,
        currencyCode: cart.cost.totalAmount.currencyCode
      },
      lineItems: cart.lines.edges.map((edge: any) => edge.node),
    };
  } catch (error) {
    console.error('❌ Cart creation failed:', error);
    // Fallback to direct cart URL
    const domain = process.env.NEXT_PUBLIC_SHOP_DOMAIN;
    const cartItems = lineItems
      .map((item) => `${item.variantId.split('/').pop()}:${item.quantity}`)
      .join(',');
    const cartUrl = `https://${domain}/cart/${cartItems}`;
    
    return {
      id: 'direct-cart',
      webUrl: cartUrl,
      subtotalPrice: { amount: '0', currencyCode: 'USD' },
      totalPrice: { amount: '0', currencyCode: 'USD' },
      lineItems: []
    };
  }
}

export const mockProducts: Product[] = [
  // Your existing mock products here if any
];

export async function getAllProductsWithFallback(): Promise<Product[]> {
  try {
    return await getAllProducts();
  } catch {
    return mockProducts;
  }
}