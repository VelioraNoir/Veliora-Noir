// src/app/returns/page.tsx - NEW FILE
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
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold tracking-tight text-black mb-6">
            Returns & Exchange Policy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our commitment to quality and your satisfaction
          </p>
        </div>

        {/* Policy Content */}
        <div className="glass-card p-8 lg:p-12 space-y-8">
          {/* No Returns Policy */}
          <section>
            <h2 className="text-2xl font-playfair font-semibold text-black mb-4">
              Final Sale Policy
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                At Veliora Noir, we take great care in curating and presenting our luxury metallic accessories. 
                Due to the exclusive nature of our handcrafted pieces and our commitment to maintaining the highest 
                standards of hygiene and authenticity, <strong>all sales are final</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not accept returns, exchanges, or provide refunds on any items purchased from our collection. 
                This policy ensures that every piece you receive is brand new and has never been worn or handled by another customer.
              </p>
            </div>
          </section>

          {/* Quality Guarantee */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-playfair font-semibold text-black mb-4">
              Our Quality Guarantee
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-black mb-3">What We Promise:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Premium materials and craftsmanship in every piece
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Accurate product descriptions and high-quality images
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Secure packaging to prevent damage during shipping
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Professional customer service and styling advice
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-black mb-3">Manufacturing Defects:</h3>
                <p className="text-gray-700 leading-relaxed">
                  In the rare event that you receive a piece with a manufacturing defect or damage 
                  that occurred during shipping, please contact us within 48 hours of delivery. 
                  We will work with you to resolve the issue promptly.
                </p>
              </div>
            </div>
          </section>

          {/* Before You Purchase */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-playfair font-semibold text-black mb-4">
              Before You Purchase
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-semibold text-amber-900 mb-3">Please Consider Carefully:</h3>
              <ul className="space-y-2 text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                  Review all product details, materials, and sizing information
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                  Use our 3D viewer to examine pieces from all angles
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                  Contact our customer service team with any questions before purchasing
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                  Consider adding items to your wishlist to think it over
                </li>
              </ul>
            </div>
          </section>

          {/* Customer Support */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-playfair font-semibold text-black mb-4">
              Need Assistance?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="font-semibold text-black mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-3">Get detailed answers to your questions</p>
                <a href="mailto:help.velioranoir@gmail.com" className="text-black hover:underline font-medium">
                  help.velioranoir@gmail.com
                </a>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-black mb-2">Pre-Purchase Consultation</h3>
                <p className="text-sm text-gray-600 mb-3">Get styling advice before you buy</p>
                <Link href="/contact" className="text-black hover:underline font-medium">
                  Contact Form
                </Link>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="font-semibold text-black mb-2">Frequently Asked Questions</h3>
                <p className="text-sm text-gray-600 mb-3">Find quick answers to common questions</p>
                <Link href="/faq" className="text-black hover:underline font-medium">
                  View FAQ
                </Link>
              </div>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-playfair font-semibold text-black mb-4">
              Policy Updates
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This returns policy is effective as of July 2024 and may be updated from time to time. 
              Any changes will be posted on this page and will apply to purchases made after the update date.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: July 10, 2024
            </p>
          </section>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-playfair font-semibold text-black mb-4">
              Ready to Find Your Perfect Piece?
            </h3>
            <p className="text-gray-600 mb-6">
              Browse our curated collection with confidence, knowing each piece is crafted to last.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/collections" className="btn-primary">
                Browse Collection
              </Link>
              <Link href="/contact" className="btn-secondary">
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}