// src/app/shipping/page.tsx - NEW FILE
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { analytics } from '../../lib/analytics';

export default function ShippingInfo() {
  useEffect(() => {
    // Track shipping info page view
    analytics.pageView('Shipping Information', 'support');
  }, []);

  const shippingMethods = [
    {
      name: "Standard Shipping",
      price: "Free on orders $200+",
      time: "5-7 business days",
      description: "Reliable delivery with tracking included",
      icon: "📦"
    },
    {
      name: "Express Shipping",
      price: "$15",
      time: "2-3 business days", 
      description: "Faster delivery for urgent orders",
      icon: "⚡"
    },
    {
      name: "Overnight Shipping",
      price: "$35",
      time: "1 business day",
      description: "Next-day delivery for last-minute gifts",
      icon: "🚀"
    },
    {
      name: "International Shipping",
      price: "$25-$75",
      time: "7-14 business days",
      description: "Worldwide delivery with customs handling",
      icon: "🌍"
    }
  ];

  const internationalRegions = [
    { region: "Canada", time: "7-10 business days", price: "$25" },
    { region: "Europe", time: "10-14 business days", price: "$45" },
    { region: "Australia & New Zealand", time: "10-14 business days", price: "$55" },
    { region: "Asia", time: "10-14 business days", price: "$50" },
    { region: "Rest of World", time: "14-21 business days", price: "$75" }
  ];

  return (
    <main className="relative bg-white min-h-screen pt-28">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold tracking-tight text-black mb-6">
            Shipping Information
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Fast, secure, and reliable delivery worldwide
          </p>
        </div>

        {/* Shipping Methods */}
        <div className="mb-16">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-8 text-center">
            Domestic Shipping (United States)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shippingMethods.map((method, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{method.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {method.name}
                    </h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-lg font-semibold text-yellow-600">
                        {method.price}
                      </span>
                      <span className="text-gray-600">
                        {method.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Time */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-6">
            Order Processing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-black mb-4">Processing Timeline:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">1</span>
                  </span>
                  <div>
                    <strong className="text-black">Order Received</strong>
                    <p className="text-sm text-gray-600">Immediate confirmation email sent</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </span>
                  <div>
                    <strong className="text-black">Quality Check</strong>
                    <p className="text-sm text-gray-600">Each piece inspected for perfection</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-xs font-bold">3</span>
                  </span>
                  <div>
                    <strong className="text-black">Luxury Packaging</strong>
                    <p className="text-sm text-gray-600">Carefully packaged with premium materials</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-600 text-xs font-bold">4</span>
                  </span>
                  <div>
                    <strong className="text-black">Shipped</strong>
                    <p className="text-sm text-gray-600">Tracking information provided</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Important Notes:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">Orders placed before 2 PM EST ship same day (Mon-Fri)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">Weekend orders process on next business day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">Custom pieces may require 3-5 additional business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">Holiday periods may extend processing time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* International Shipping */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-6">
            International Shipping
          </h2>
          <p className="text-gray-600 mb-6">
            We ship worldwide with secure, trackable delivery. All international shipments include customs handling.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-black">Region</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Delivery Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-black">Shipping Cost</th>
                </tr>
              </thead>
              <tbody>
                {internationalRegions.map((region, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">{region.region}</td>
                    <td className="py-3 px-4 text-gray-600">{region.time}</td>
                    <td className="py-3 px-4 text-yellow-600 font-semibold">{region.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="font-semibold text-amber-900 mb-2">International Shipping Notes:</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Customs duties and taxes are the responsibility of the recipient</li>
              <li>• Delivery times may vary due to local customs processing</li>
              <li>• All packages are fully insured and tracked</li>
              <li>• Free international shipping on orders over $500</li>
            </ul>
          </div>
        </div>

        {/* Packaging */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-6">
            Luxury Packaging
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-semibold text-black mb-4">What's Included:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-xl">🎁</span>
                  <div>
                    <strong className="text-black">Premium Gift Box</strong>
                    <p className="text-sm text-gray-600">Elegant black box with gold foil logo</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">💎</span>
                  <div>
                    <strong className="text-black">Protective Pouch</strong>
                    <p className="text-sm text-gray-600">Soft velvet jewelry pouch for storage</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">📜</span>
                  <div>
                    <strong className="text-black">Care Instructions</strong>
                    <p className="text-sm text-gray-600">Detailed care guide for your jewelry</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl">✨</span>
                  <div>
                    <strong className="text-black">Authenticity Certificate</strong>
                    <p className="text-sm text-gray-600">Proof of authenticity and quality</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl aspect-square flex items-center justify-center">
              <div className="text-center text-gray-400">
                <span className="text-4xl block mb-2">📦</span>
                <p className="text-sm">Luxury Packaging</p>
                <p className="text-xs">Premium Presentation</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-6">
            Shipping FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-black mb-2">
                Can I change my shipping address after ordering?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, if your order hasn't shipped yet. Contact us immediately at help.velioranoir@gmail.com with your order number.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-black mb-2">
                Do you ship to P.O. boxes?
              </h3>
              <p className="text-gray-600 text-sm">
                We recommend shipping to a physical address for security. P.O. boxes are accepted for standard shipping only.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-black mb-2">
                What if my package is lost or damaged?
              </h3>
              <p className="text-gray-600 text-sm">
                All shipments are fully insured. Contact us immediately if your package arrives damaged or doesn't arrive within the expected timeframe.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-black mb-2">
                Can I schedule a specific delivery date?
              </h3>
              <p className="text-gray-600 text-sm">
                While we can't guarantee specific delivery dates, we can accommodate special requests. Contact us for assistance with time-sensitive deliveries.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-playfair font-semibold text-black mb-4">
              Questions About Shipping?
            </h3>
            <p className="text-gray-600 mb-6">
              Our customer service team is here to help with any shipping questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Contact Support
              </Link>
              <Link href="/track" className="btn-secondary">
                Track Your Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}