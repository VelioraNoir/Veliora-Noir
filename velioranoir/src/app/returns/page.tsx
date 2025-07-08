'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { analytics } from '../../lib/analytics';

export default function ReturnsPolicy() {
  useEffect(() => {
    // Track returns policy page view
    analytics.pageView('Returns Policy', 'policy');
  }, []);

  return (
    <main className="relative bg-white min-h-screen pt-28">
      <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-playfair font-bold tracking-tight text-black mb-4">
            30-Day Returns Policy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your satisfaction is our priority—shop with confidence.
          </p>
        </div>

        {/* 30-Day Return Window */}
        <section className="glass-card p-8 lg:p-12 space-y-6">
          <h2 className="text-2xl font-playfair font-semibold text-black">
            30-Day Returns
          </h2>
          <p className="text-gray-700 leading-relaxed">
            You have <strong>30 days</strong> from the date your order is delivered to return eligible items for a full refund or store credit.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Items must be unworn, unwashed, and in original condition with tags and packaging intact.</li>
            <li>Custom or personalized pieces are <strong>not</strong> eligible for return.</li>
            <li>Return shipping costs are <strong>your responsibility</strong>, unless the item is defective.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            To start a return, please email us at{' '}
            <a href="mailto:help.velioranoir@gmail.com" className="text-yellow-600 hover:underline">
              help.velioranoir@gmail.com
            </a>{' '}
            with your order number and reason for return. We’ll send you a pre-formatted return label when possible.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Note:</strong> All returns must comply with our supplier guidelines. We source our products via Zendrop, so please review the{' '}
            <Link
              href="https://help.zendrop.com/hc/en-us/articles/360060025234-Zendrop-Return-Policy"
              className="text-yellow-600 hover:underline"
              target="_blank"
              rel="noopener"
            >
              Zendrop Return Policy
            </Link>{' '}
            and we’ll coordinate on your behalf to process it promptly.
          </p>
        </section>

        {/* Quality Guarantee */}
        <section className="glass-card p-8 lg:p-12 space-y-6 border-t border-gray-200">
          <h2 className="text-2xl font-playfair font-semibold text-black">
            Quality Guarantee
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you receive a defective or damaged item, notify us within 48 hours of delivery and we’ll make it right—no restocking fees.
          </p>
        </section>

        {/* Before You Purchase */}
        <section className="glass-card p-8 lg:p-12 space-y-6 border-t border-gray-200">
          <h2 className="text-2xl font-playfair font-semibold text-black">
            Before You Purchase
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-amber-900 mb-3">Please Consider Carefully:</h3>
            <ul className="list-disc list-inside text-amber-800 space-y-2">
              <li>Review all product details, materials, and sizing before you buy.</li>
              <li>Contact customer service with any questions prior to placing your order.</li>
              <li>Add items to your wishlist if you need more time to decide.</li>
            </ul>
          </div>
        </section>

        {/* Policy Updates */}
        <section className="border-t border-gray-200 pt-8 text-sm text-gray-500">
          <p>This policy is effective July 7, 2025 and may be updated. Any changes apply to purchases made after the update date.</p>
          <p>Last updated: July 7, 2025</p>
        </section>
      </div>
    </main>
  );
}
