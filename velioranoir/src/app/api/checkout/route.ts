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

    // Add our thank-you page as the return URL with purchase tracking data
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://velioranoir.com' 
      : 'http://localhost:3000';
    
    // Prepare purchase data for thank-you page
    const totalAmount = typeof checkout.totalPrice === 'string' 
      ? checkout.totalPrice 
      : checkout.totalPrice.amount;
    
    const purchaseData = {
      order_id: checkout.id,
      total: totalAmount,
      item_count: lineItems.length,
      items: encodeURIComponent(JSON.stringify(
        lineItems.map((item: { variantId?: string; title?: string; quantity?: number }, index: number) => ({
          id: item.variantId || `item_${index}`,
          name: item.title || `Product ${index + 1}`,
          quantity: item.quantity || 1,
          price: parseFloat(totalAmount) / lineItems.length // Approximate price per item
        }))
      ))
    };

    const thankYouUrl = `${baseUrl}/thank-you?${new URLSearchParams(purchaseData).toString()}`;
    
    // Note: In a real implementation, you'd set this as the Shopify checkout's return URL
    // For now, we'll include it in the response for manual redirect setup
    console.log('📧 Thank you page URL:', thankYouUrl);
    
    console.log('✅ Checkout created successfully:', checkoutUrl);

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutUrl,
      checkoutId: checkout.id,
      total: totalAmount,
      thankYouUrl: thankYouUrl // Include for potential future use
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