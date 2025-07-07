// src/app/care/page.tsx - NEW FILE
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { analytics } from '../../lib/analytics';

export default function CareInstructions() {
  useEffect(() => {
    // Track care instructions page view
    analytics.pageView('Care Instructions', 'support');
  }, []);

  const materialCare = [
    {
      material: "Gold Jewelry",
      icon: "✨",
      tips: [
        "Clean with a soft, lint-free cloth after each wear",
        "Use warm water with mild soap for deeper cleaning",
        "Store separately in soft pouches to prevent scratching",
        "Remove before swimming, exercising, or showering"
      ],
      avoid: ["Harsh chemicals", "Abrasive cleaners", "Chlorine", "Perfume contact"]
    },
    {
      material: "Silver Jewelry",
      icon: "🌟",
      tips: [
        "Polish regularly with a silver polishing cloth",
        "Store in anti-tarnish bags or cloth",
        "Wear frequently - natural oils help prevent tarnish",
        "Clean with silver-specific cleaning solution"
      ],
      avoid: ["Rubber bands", "Wool", "Latex", "Household chemicals"]
    },
    {
      material: "Gemstones & Diamonds",
      icon: "💎",
      tips: [
        "Clean with a soft brush and mild soapy water",
        "Have professionally cleaned once a year",
        "Check settings regularly for loose stones",
        "Store individually to prevent scratching"
      ],
      avoid: ["Ultrasonic cleaners (for some gems)", "Extreme temperatures", "Hard impacts", "Steam cleaning (emeralds, opals)"]
    },
    {
      material: "Leather Accessories",
      icon: "👜",
      tips: [
        "Condition every 3-6 months with leather conditioner",
        "Store stuffed with tissue paper to maintain shape",
        "Allow to air dry if wet, away from direct heat",
        "Dust regularly with a soft, dry cloth"
      ],
      avoid: ["Direct sunlight", "Excessive moisture", "Plastic storage bags", "Harsh cleaning products"]
    },
    {
      material: "Silk Scarves",
      icon: "🧣",
      tips: [
        "Dry clean or hand wash in cold water",
        "Iron on low heat with pressing cloth",
        "Store rolled or hung to prevent creasing",
        "Air dry away from direct sunlight"
      ],
      avoid: ["Machine washing", "Wringing or twisting", "Bleach", "Direct heat"]
    },
    {
      material: "Watches",
      icon: "⌚",
      tips: [
        "Service mechanical watches every 3-5 years",
        "Clean with a soft, damp cloth",
        "Store in a watch box or pouch",
        "Wind automatic watches regularly if not worn"
      ],
      avoid: ["Magnetic fields", "Extreme temperatures", "Impact or drops", "Water (unless water-resistant)"]
    }
  ];

  const generalTips = [
    {
      title: "Daily Care",
      icon: "☀️",
      description: "Simple habits that make a big difference",
      tips: [
        "Put accessories on last, after makeup and perfume",
        "Remove jewelry before sleeping",
        "Wipe down items after each wear",
        "Handle with clean, dry hands"
      ]
    },
    {
      title: "Storage Solutions",
      icon: "📦",
      description: "Proper storage extends the life of your pieces",
      tips: [
        "Use individual soft pouches or compartments",
        "Keep in a cool, dry place",
        "Maintain consistent temperature and humidity",
        "Use silica gel packets to control moisture"
      ]
    },
    {
      title: "Professional Care",
      icon: "🔧",
      description: "When to seek expert assistance",
      tips: [
        "Annual professional cleaning for fine jewelry",
        "Immediate repair for loose stones or clasps",
        "Professional restoration for vintage pieces",
        "Regular maintenance checks for watches"
      ]
    }
  ];

  const cleaningSteps = [
    { step: 1, action: "Prepare", details: "Gather soft cloths, mild soap, and warm water" },
    { step: 2, action: "Inspect", details: "Check for loose stones or damaged areas" },
    { step: 3, action: "Clean", details: "Gently clean with appropriate method for material" },
    { step: 4, action: "Rinse", details: "Use clean, lukewarm water to remove soap" },
    { step: 5, action: "Dry", details: "Pat dry with a soft, lint-free cloth" },
    { step: 6, action: "Polish", details: "Use appropriate polishing cloth for final shine" }
  ];

  return (
    <main className="relative bg-white min-h-screen pt-28">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold tracking-tight text-black mb-6">
            Care Instructions
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Preserve the beauty and elegance of your luxury accessories
          </p>
        </div>

        {/* General Tips */}
        <div className="mb-16">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-8 text-center">
            Essential Care Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {generalTips.map((category, index) => (
              <div key={index} className="glass-card p-6">
                <div className="text-center mb-4">
                  <span className="text-4xl block mb-3">{category.icon}</span>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.description}
                  </p>
                </div>
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Material-Specific Care */}
        <div className="mb-16">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-8 text-center">
            Care by Material Type
          </h2>
          <div className="space-y-6">
            {materialCare.map((item, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="text-xl font-semibold text-black">
                    {item.material}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-black mb-3">Recommended Care:</h4>
                    <ul className="space-y-2">
                      {item.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-sm text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-black mb-3">What to Avoid:</h4>
                    <ul className="space-y-2">
                      {item.avoid.map((avoid, avoidIndex) => (
                        <li key={avoidIndex} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">✗</span>
                          <span className="text-sm text-gray-700">{avoid}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cleaning Process */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-6">
            Professional Cleaning Process
          </h2>
          <p className="text-gray-600 mb-8">
            Follow these steps for safe and effective cleaning of your luxury accessories.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cleaningSteps.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-1">{item.action}</h4>
                  <p className="text-sm text-gray-600">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Care */}
        <div className="glass-card p-8 mb-12 border-2 border-amber-200">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-6">
            Emergency Care Situations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-black mb-4">Quick Action Guide:</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-black mb-2">💧 Water Damage</h4>
                  <p className="text-sm text-gray-600">
                    Pat dry immediately with soft cloth. Air dry completely before storing. 
                    For watches, seek professional service immediately.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-2">🧪 Chemical Exposure</h4>
                  <p className="text-sm text-gray-600">
                    Rinse with clean water immediately. Dry thoroughly and have professionally 
                    cleaned as soon as possible.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-2">⚡ Impact Damage</h4>
                  <p className="text-sm text-gray-600">
                    Collect all pieces carefully. Do not attempt repairs. Contact us for 
                    professional restoration services.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">24/7 Care Support:</h3>
              <div className="bg-amber-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  For urgent care situations or questions about your luxury pieces, our expert team is here to help.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong className="text-black">Email:</strong>{' '}
                    <a href="mailto:help.velioranoir@gmail.com" className="text-yellow-600 hover:underline">
                      help.velioranoir@gmail.com
                    </a>
                  </p>
                  <p className="text-sm">
                    <strong className="text-black">Response Time:</strong>{' '}
                    <span className="text-gray-600">Within 24 hours</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-black mb-2">
                How often should I clean my jewelry?
              </h3>
              <p className="text-gray-600 text-sm">
                Light cleaning after each wear is recommended. Deep cleaning should be done monthly 
                for frequently worn pieces, and professional cleaning annually.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-black mb-2">
                Can I use ultrasonic cleaners on all jewelry?
              </h3>
              <p className="text-gray-600 text-sm">
                No. While safe for diamonds and hard gemstones, ultrasonic cleaners can damage 
                softer stones like emeralds, opals, and pearls. Always check before use.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-black mb-2">
                What's the best way to store my accessories when traveling?
              </h3>
              <p className="text-gray-600 text-sm">
                Use a travel jewelry case with individual compartments. Wrap delicate pieces in 
                soft cloth. Keep valuable items in carry-on luggage, never in checked bags.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-black mb-2">
                How do I maintain the patina on my leather goods?
              </h3>
              <p className="text-gray-600 text-sm">
                Regular conditioning and gentle use will develop a beautiful patina. Avoid 
                over-cleaning and let natural oils from handling enhance the leather's character.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-2">
                Is it safe to clean vintage or antique pieces at home?
              </h3>
              <p className="text-gray-600 text-sm">
                For valuable vintage pieces, we recommend professional cleaning only. Home cleaning 
                can damage delicate settings or remove desirable patina from antique items.
              </p>
            </div>
          </div>
        </div>

        {/* Warranty & Service */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-6">
            Warranty & Professional Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-black mb-4">Lifetime Care Promise</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">★</span>
                  <span>Complimentary annual cleaning for all purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">★</span>
                  <span>Free minor repairs within first year</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">★</span>
                  <span>Professional restoration services available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">★</span>
                  <span>Expert consultation for care and maintenance</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Additional Services</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">◆</span>
                  <span>Jewelry resizing and adjustments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">◆</span>
                  <span>Stone replacement and resetting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">◆</span>
                  <span>Engraving and personalization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">◆</span>
                  <span>Appraisal and insurance documentation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Care Kit Promotion */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-playfair font-semibold mb-4">
              Professional Care Kit
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Everything you need to maintain your luxury accessories at home. 
              Includes premium cleaning cloths, gentle cleansers, and storage solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop/care-kit" className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors">
                Shop Care Kit - $75
              </Link>
              <Link href="/contact" className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-playfair font-semibold text-black mb-4">
              Need Care Assistance?
            </h3>
            <p className="text-gray-600 mb-6">
              Our luxury care specialists are available to answer your questions and provide personalized advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Contact Care Team
              </Link>
              <Link href="/warranty" className="btn-secondary">
                View Warranty Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}