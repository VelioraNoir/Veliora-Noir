// src/lib/shopifyTest.ts - Updated for Storefront API Client
import { client } from './shopify';

declare global {
  interface Window {
    testShopify: typeof testShopifyConnection;
  }
}

const SHOP_QUERY = `
  query {
    shop {
      name
      description
      primaryDomain {
        url
      }
    }
  }
`;

const TEST_CART_MUTATION = `
  mutation {
    cartCreate(input: {}) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function testShopifyConnection() {
  const domain = process.env.NEXT_PUBLIC_SHOP_DOMAIN;
  const token = process.env.NEXT_PUBLIC_STOREFRONT_TOKEN;
  
  console.log('🔍 Testing Shopify Storefront API Client connection...');
  console.log('Domain:', domain);
  console.log('Token exists:', !!token);

  if (!domain || !token) {
    throw new Error('Missing Shopify credentials');
  }

  if (!client) {
    throw new Error('Shopify client not initialized');
  }

  try {
    // Test basic shop info
    const { data: shopData, errors: shopErrors } = await client.request(SHOP_QUERY);
    
    if (shopErrors) {
      console.error('❌ Shop query errors:', shopErrors);
      throw new Error(`Shop query failed: ${JSON.stringify(shopErrors)}`);
    }

    console.log('✅ Shop info:', shopData.shop);

    // Test creating an empty cart
    try {
      const { data: cartData, errors: cartErrors } = await client.request(TEST_CART_MUTATION);
      
      if (cartErrors) {
        console.log('❌ Cart creation errors:', cartErrors);
        return { 
          success: false, 
          method: 'direct_url', 
          shop: shopData.shop,
          error: cartErrors,
          fallbackAvailable: true 
        };
      }

      if (cartData.cartCreate.userErrors.length > 0) {
        console.log('❌ Cart creation user errors:', cartData.cartCreate.userErrors);
        return { 
          success: false, 
          method: 'direct_url', 
          shop: shopData.shop,
          error: cartData.cartCreate.userErrors,
          fallbackAvailable: true 
        };
      }

      console.log('✅ Empty cart created successfully:', cartData.cartCreate.cart.id);
      return { 
        success: true, 
        method: 'storefront_api_client', 
        shop: shopData.shop,
        cart: cartData.cartCreate.cart
      };
    } catch (cartError) {
      console.log('❌ Cart creation failed:', cartError);
      return { 
        success: false, 
        method: 'direct_url', 
        shop: shopData.shop,
        error: cartError,
        fallbackAvailable: true 
      };
    }
  } catch (error) {
    console.error('❌ Complete connection failure:', error);
    throw error;
  }
}

// Test function you can call in browser console
if (typeof window !== 'undefined') {
  window.testShopify = testShopifyConnection;
}