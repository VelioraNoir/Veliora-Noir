// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '../../../lib/shopify';

export async function POST(request: NextRequest) {
  try {
    const { lineItems } = await request.json();
    
    // Validate that we have line items
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    console.log('🛒 Creating checkout with items:', lineItems);

    // Create checkout with Shopify
    const checkout = await createCheckout(lineItems);
    
    let checkoutUrl = checkout.webUrl;
    
    // ALWAYS use Shopify domain for development and testing
    const shopDomain = process.env.NEXT_PUBLIC_SHOP_DOMAIN;
    if (shopDomain && shopDomain.includes('.myshopify.com')) {
      checkoutUrl = checkoutUrl.replace(
        /https?:\/\/[^\/]+/,
        `https://${shopDomain}`
      );
      console.log('🛠 Using Shopify domain for reliable checkout:', checkoutUrl);
    }
    
    console.log('✅ Checkout created successfully:', checkoutUrl);

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutUrl,
      checkoutId: checkout.id,
      total: checkout.totalPrice
    });

  } catch (error) {
    console.error('❌ Checkout creation failed:', error);
    
    // Return error but don't crash
    return NextResponse.json(
      { 
        error: 'Failed to create checkout',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}