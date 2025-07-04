// src/lib/shopifyTest.ts - Simple API Test
import Client from 'shopify-buy';

export async function testShopifyConnection() {
  const domain = process.env.NEXT_PUBLIC_SHOP_DOMAIN;
  const token = process.env.NEXT_PUBLIC_STOREFRONT_TOKEN;
  
  console.log('🔍 Testing Shopify connection...');
  console.log('Domain:', domain);
  console.log('Token exists:', !!token);

  if (!domain || !token) {
    throw new Error('Missing Shopify credentials');
  }

  try {
    const client = Client.buildClient({
      domain,
      storefrontAccessToken: token,
    });

    // Test basic shop info
    const shop = await client.shop.fetchInfo();
    console.log('✅ Shop info:', shop);

    // Test creating an empty checkout (to see exact error)
    try {
      const checkout = await client.checkout.create();
      console.log('✅ Empty checkout created successfully:', checkout.id);
      return { success: true, method: 'legacy_checkout', shop };
    } catch (checkoutError) {
      console.log('❌ Legacy checkout failed:', checkoutError);
      return { 
        success: false, 
        method: 'direct_url', 
        shop,
        error: checkoutError,
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
  (window as any).testShopify = testShopifyConnection;
}