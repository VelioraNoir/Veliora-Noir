// src/components/debug/AnalyticsTest.tsx
'use client';

import { useState } from 'react';
import { analytics } from '../../lib/analytics';

export default function AnalyticsTest() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testGoogleAnalytics = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'test_event', {
        event_category: 'test',
        event_label: 'analytics_test'
      });
      addResult('✅ Google Analytics event sent');
    } else {
      addResult('❌ Google Analytics not loaded');
    }
  };

  const testFacebookPixel = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
      addResult('✅ Facebook Pixel event sent');
    } else {
      addResult('❌ Facebook Pixel not loaded');
    }
  };

  const testTikTokPixel = () => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('ViewContent', {
        content_type: 'test'
      });
      addResult('✅ TikTok Pixel event sent');
    } else {
      addResult('❌ TikTok Pixel not loaded');
    }
  };

  const testNewsletterEvent = () => {
    analytics.newsletterSignup('test@example.com', 'analytics_test');
    addResult('✅ Newsletter signup event sent to all platforms');
  };

  const testProductView = () => {
    analytics.productView('test-product', 'Test Product', '99.99', 'Test Category');
    addResult('✅ Product view event sent to all platforms');
  };

  const testAddToCart = () => {
    analytics.addToCart('test-product', 'Test Product', '99.99', 1);
    addResult('✅ Add to cart event sent to all platforms');
  };

  const checkEnvironmentVariables = () => {
    const vars = {
      'Google Analytics ID': process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      'GTM ID': process.env.NEXT_PUBLIC_GTM_ID,
      'Facebook Pixel ID': process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
      'TikTok Pixel ID': process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
      'HubSpot Portal ID': process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID
    };

    Object.entries(vars).forEach(([name, value]) => {
      if (value) {
        addResult(`✅ ${name}: ${value.substring(0, 10)}...`);
      } else {
        addResult(`❌ ${name}: Not set`);
      }
    });
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Don't show in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 w-96 max-h-96 overflow-auto bg-white border-2 border-blue-500 rounded-lg p-4 shadow-xl z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-600">📊 Analytics Test</h3>
        <button 
          onClick={clearResults}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <button 
          onClick={checkEnvironmentVariables}
          className="w-full px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
        >
          Check Environment Variables
        </button>
        
        <button 
          onClick={testGoogleAnalytics}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Test Google Analytics
        </button>
        
        <button 
          onClick={testFacebookPixel}
          className="w-full px-3 py-2 bg-blue-800 text-white rounded text-sm hover:bg-blue-900"
        >
          Test Facebook Pixel
        </button>
        
        <button 
          onClick={testTikTokPixel}
          className="w-full px-3 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
        >
          Test TikTok Pixel
        </button>
        
        <button 
          onClick={testNewsletterEvent}
          className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
        >
          Test Newsletter Event
        </button>
        
        <button 
          onClick={testProductView}
          className="w-full px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
        >
          Test Product View
        </button>
        
        <button 
          onClick={testAddToCart}
          className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Test Add to Cart
        </button>
      </div>

      <div className="max-h-40 overflow-y-auto">
        <h4 className="font-bold text-sm mb-2">Test Results:</h4>
        <div className="space-y-1 text-xs">
          {testResults.map((result, index) => (
            <div key={index} className="bg-gray-50 p-1 rounded">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}