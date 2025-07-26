'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TestPurchasePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    order_id: `test_order_${Date.now()}`,
    total: '99.99',
    item_count: '2',
    email: 'test@example.com'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create test purchase data
    const purchaseData = {
      order_id: formData.order_id,
      total: formData.total,
      item_count: formData.item_count,
      email: formData.email,
      items: encodeURIComponent(JSON.stringify([
        { id: 'test_ring_1', name: 'Elegant Silver Ring', quantity: 1, price: 49.99 },
        { id: 'test_necklace_1', name: 'Golden Chain Necklace', quantity: 1, price: 49.99 }
      ]))
    };

    // Redirect to thank you page with test data
    const thankYouUrl = `/thank-you?${new URLSearchParams(purchaseData).toString()}`;
    router.push(thankYouUrl);
  };

  return (
    <main className="relative bg-white min-h-screen pt-20">
      <section className="py-24 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-black mb-4">
              Test Purchase Tracking
            </h1>
            <p className="text-lg text-gray-600">
              Use this page to test the Meta Pixel purchase event tracking
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  value={formData.order_id}
                  onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="test_order_123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="99.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Items
                </label>
                <input
                  type="number"
                  value={formData.item_count}
                  onChange={(e) => setFormData({ ...formData, item_count: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="customer@example.com"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-all duration-300 hover:shadow-xl"
              >
                Test Purchase Event →
              </button>
            </form>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">Testing Instructions</h3>
                  <p className="text-sm text-yellow-700">
                    This will simulate a purchase completion and fire the Meta Pixel purchase event. 
                    Open browser dev tools to see the tracking logs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}