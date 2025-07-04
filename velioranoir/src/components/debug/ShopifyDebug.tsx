// src/components/debug/ShopifyDebug.tsx - Add this to test your Shopify connection
'use client';

import { useState, useEffect } from 'react';
import { getAllProducts } from '../../lib/shopify';

export default function ShopifyDebug() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Testing Shopify connection...');
      console.log('Domain:', process.env.NEXT_PUBLIC_SHOP_DOMAIN);
      console.log('Token exists:', !!process.env.NEXT_PUBLIC_STOREFRONT_TOKEN);
      
      const fetchedProducts = await getAllProducts();
      console.log('✅ Raw products from Shopify:', fetchedProducts);
      
      setProducts(fetchedProducts);
      setRawData(fetchedProducts);
      
      if (fetchedProducts.length === 0) {
        setError('No products found. Check if products are published and available for sale in your Shopify store.');
      }
    } catch (err) {
      console.error('❌ Shopify connection failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show debug component in production
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto bg-white border-2 border-red-500 rounded-lg p-4 shadow-xl z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-red-600">🔧 Shopify Debug</h3>
        <button 
          onClick={testConnection}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Refresh'}
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <strong>Store Domain:</strong> 
          <code className="bg-gray-100 px-1 rounded ml-2">
            {process.env.NEXT_PUBLIC_SHOP_DOMAIN || 'NOT SET'}
          </code>
        </div>
        
        <div>
          <strong>API Token:</strong> 
          <code className="bg-gray-100 px-1 rounded ml-2">
            {process.env.NEXT_PUBLIC_STOREFRONT_TOKEN ? 'SET ✅' : 'NOT SET ❌'}
          </code>
        </div>

        <div>
          <strong>Products Found:</strong> 
          <span className={`ml-2 font-bold ${products.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {products.length}
          </span>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 rounded p-2">
            <strong className="text-red-700">Error:</strong>
            <div className="text-red-600 text-xs mt-1">{error}</div>
          </div>
        )}

        {products.length > 0 && (
          <div>
            <strong>Products:</strong>
            <div className="max-h-32 overflow-auto mt-1">
              {products.map((product, index) => (
                <div key={index} className="text-xs bg-gray-50 p-1 rounded mb-1">
                  <div><strong>{product.title}</strong></div>
                  <div>Price: ${product.variants[0]?.price || 'N/A'}</div>
                  <div>Available: {product.variants[0]?.available ? '✅' : '❌'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <details className="text-xs">
          <summary className="cursor-pointer font-bold">Raw API Data</summary>
          <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-24">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}