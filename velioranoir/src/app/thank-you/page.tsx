'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { analytics } from '../../lib/analytics';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    total: number;
    items: Array<{ id: string; name: string; quantity: number; price: number }>;
    email?: string;
  } | null>(null);

  useEffect(() => {
    // Extract order details from URL parameters
    const orderId = searchParams.get('order_id') || searchParams.get('order') || `order_${Date.now()}`;
    const total = parseFloat(searchParams.get('total') || searchParams.get('amount') || '0');
    const email = searchParams.get('email') || searchParams.get('customer_email');
    
    // Try to parse items from URL or create generic items
    let items: Array<{ id: string; name: string; quantity: number; price: number }> = [];
    
    try {
      const itemsParam = searchParams.get('items');
      if (itemsParam) {
        items = JSON.parse(decodeURIComponent(itemsParam));
      } else {
        // Create generic item if no specific items provided
        const itemCount = parseInt(searchParams.get('item_count') || '1');
        const avgPrice = total / itemCount;
        items = Array.from({ length: itemCount }, (_, i) => ({
          id: `item_${i + 1}`,
          name: `Product ${i + 1}`,
          quantity: 1,
          price: avgPrice
        }));
      }
    } catch (error) {
      console.error('Error parsing items:', error);
      // Fallback to single generic item
      items = [{
        id: 'generic_product',
        name: 'Jewelry Purchase',
        quantity: 1,
        price: total
      }];
    }

    const details = {
      orderId,
      total,
      items,
      email: email || undefined
    };

    setOrderDetails(details);

    // Fire the purchase event if we have valid data
    if (total > 0) {
      console.log('🎯 Firing purchase event:', details);
      
      // Fire the purchase event with a slight delay to ensure pixels are loaded
      setTimeout(() => {
        analytics.purchase(
          details.orderId,
          details.items.map(item => ({ id: item.id })),
          details.total,
          details.email
        );
        
        console.log('✅ Purchase event fired successfully');
      }, 1000);

      // Track thank you page view
      analytics.pageView('Thank You', 'checkout_completion');
      
      // Track conversion completion
      analytics.trackEvent('purchase_completion', {
        order_id: details.orderId,
        order_value: details.total,
        item_count: details.items.length,
        checkout_method: 'shopify'
      });
    }
  }, [searchParams]);

  return (
    <main className="relative bg-white min-h-screen pt-20">
      {/* Success Hero */}
      <section className="relative py-24 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-100/20 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Success Animation */}
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-light tracking-tight text-black mb-6">
            <span className="block font-serif italic text-2xl lg:text-3xl text-gray-600 mb-2">Thank You!</span>
            <span className="font-semibold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Order Confirmed</span>
          </h1>
          
          <div className="w-24 h-px bg-gradient-to-r from-green-500 to-transparent mx-auto mb-8" />
          
          <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
            Your exquisite jewelry is being carefully prepared and will be shipped with the utmost care.
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-lg mb-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-black mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-mono font-medium text-black">{orderDetails.orderId}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium text-black">{orderDetails.items.length} piece{orderDetails.items.length !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total:</span>
                  <span className="text-2xl font-bold text-black">${orderDetails.total.toFixed(2)}</span>
                </div>
                
                {orderDetails.email && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Confirmation sent to:</span>
                    <span className="font-medium text-black">{orderDetails.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Confirmation Email</h3>
              <p className="text-sm text-gray-600">Order details and tracking info sent to your email</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Careful Packaging</h3>
              <p className="text-sm text-gray-600">Each piece wrapped in luxury packaging</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Express delivery within 3-5 business days</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 hover:shadow-xl"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/collections"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-medium hover:border-black hover:bg-black hover:text-white transition-all duration-300"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-black mb-4">Join Our Community</h2>
            <p className="text-lg text-gray-600">
              Share your Veliora Noir moments and inspire others
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-rose-50 to-white border border-gray-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Share on Social</h3>
              <p className="text-gray-600 mb-4">Tag us @velioranoir for a chance to be featured</p>
              <button 
                onClick={() => analytics.trackEvent('social_share_intent', { platform: 'instagram', source: 'thank_you_page' })}
                className="text-rose-600 hover:text-rose-700 font-medium"
              >
                #VelioraNoir →
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white border border-gray-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2">Leave a Review</h3>
              <p className="text-gray-600 mb-4">Help others discover the perfect piece</p>
              <button 
                onClick={() => analytics.trackEvent('review_intent', { source: 'thank_you_page' })}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Write Review →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}