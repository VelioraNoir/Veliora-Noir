// src/app/faq/page.tsx - NEW FILE
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { analytics } from '../../lib/analytics';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    // Track FAQ page view
    analytics.pageView('FAQ', 'support');
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
    
    // Track FAQ interaction
    analytics.trackEvent('faq_toggle', {
      faq_index: index,
      faq_question: faqs[index]?.question.substring(0, 50) || 'unknown',
      action: openIndex === index ? 'close' : 'open'
    });
  };

  const faqs = [
    // General Questions
    {
      category: "General",
      question: "What makes Veliora Noir different?",
      answer: "We focus on curating exceptional pieces that offer luxury styling at accessible prices. Every item is selected for its design excellence, quality, and timeless appeal. Our innovative 3D viewer lets you explore each piece in stunning detail, while our customer service team is always ready to help you find exactly what you're looking for."
    },
    {
      category: "General",
      question: "When does the presale start?",
      answer: "Our presale launched July 10th at 12pm PST / 9am HST. Newsletter subscribers get early access and exclusive pricing. If you haven't signed up yet, you can still join our newsletter to be notified about future launches and exclusive offers."
    },
    {
      category: "General",
      question: "What materials do you use?",
      answer: "We work with premium metals including sterling silver, gold-filled, and platinum. All pieces are nickel-free and hypoallergenic. Our collection features handcrafted metallic accessories with sophisticated finishes that are designed to last and maintain their beauty over time."
    },
    
    // Products & Quality
    {
      category: "Products",
      question: "How do you ensure quality?",
      answer: "Our team carefully evaluates each piece against strict quality standards. We work only with trusted suppliers and thoroughly inspect every aspect of design and construction. Each piece undergoes multiple quality checks before being added to our collection."
    },
    {
      category: "Products", 
      question: "Are your pieces hypoallergenic?",
      answer: "Yes! All our jewelry features hypoallergenic materials and nickel-free construction. Our earrings come with surgical steel posts, and all pieces are safe for sensitive skin. We're committed to ensuring our accessories can be worn comfortably by everyone."
    },
    {
      category: "Products",
      question: "Do you offer custom sizing?",
      answer: "Yes! We offer custom sizing for rings and adjustable options for other pieces. Many of our bracelets feature adjustable sizing for the perfect fit. Contact us with your measurements for a personalized quote and sizing recommendations."
    },
    
    // Ordering & Shipping
    {
      category: "Ordering",
      question: "What's your return policy?",
      answer: "All sales are final. Due to the exclusive nature of our handcrafted pieces and our commitment to maintaining the highest standards of hygiene and authenticity, we do not accept returns or exchanges. However, we will work with you to resolve any issues with manufacturing defects or shipping damage."
    },
    {
      category: "Ordering",
      question: "Do you offer international shipping?",
      answer: "Yes! We ship worldwide with secure, trackable shipping. Delivery times vary by location, typically 7-14 business days internationally. All international orders are fully insured and tracked from our facility to your door."
    },
    {
      category: "Ordering",
      question: "How long does shipping take?",
      answer: "Orders are processed within 2-3 business days. Domestic shipping typically takes 5-7 business days, while international shipping takes 7-14 business days. All orders include tracking information and are fully insured."
    },
    {
      category: "Ordering",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and other secure payment methods through our Shopify checkout. All transactions are encrypted and secure."
    },
    
    // Care & Maintenance
    {
      category: "Care",
      question: "How should I care for my jewelry?",
      answer: "Clean your pieces with a soft microfiber cloth and store them in individual pouches to prevent scratching. Avoid contact with chemicals, lotions, and perfumes. For deeper cleaning, use warm soapy water and dry completely before storing. Remove jewelry before swimming or exercising."
    },
    {
      category: "Care",
      question: "Will my jewelry tarnish?",
      answer: "Our premium materials are designed to resist tarnishing with proper care. Sterling silver pieces may develop a natural patina over time, which can be easily cleaned. Gold-filled and platinum pieces maintain their finish with minimal maintenance."
    },
    
    // Customer Service
    {
      category: "Support",
      question: "How can I contact customer service?",
      answer: "Our team is available via email at help.velioranoir@gmail.com. We respond within 24 hours and are here to help with any questions, styling advice, or concerns you may have."
    },
    {
      category: "Support",
      question: "Do you offer styling consultations?",
      answer: "Yes! Our team provides complimentary styling advice to help you select pieces that complement your personal style and occasions. Contact us through our contact form or email with details about what you're looking for."
    },
    {
      category: "Support",
      question: "Can I get help with sizing?",
      answer: "Absolutely! We're happy to help you find the perfect fit. For rings, we can provide sizing guidance, and many of our pieces feature adjustable elements. Contact us with any sizing questions before making your purchase."
    }
  ];

  // Group FAQs by category
    interface FAQItem {
        category: string;
        question: string;
        answer: string;
        index: number;
    }

    const faqsByCategory = faqs.reduce<Record<string, FAQItem[]>>((acc, faq, index) => {
        if (!acc[faq.category]) acc[faq.category] = [];
        acc[faq.category].push({ ...faq, index });
        return acc;
    }, {});


  return (
    <main className="relative bg-white min-h-screen pt-28">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold tracking-tight text-black mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Everything you need to know about Veliora Noir
          </p>
        </div>

        {/* Quick Links */}
        <div className="glass-card p-6 mb-12">
          <h2 className="text-lg font-semibold text-black mb-4">Jump to Section:</h2>
          <div className="flex flex-wrap gap-3">
            {Object.keys(faqsByCategory).map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase()}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
                onClick={() => {
                  analytics.trackEvent('faq_category_jump', {
                    category: category,
                    user_behavior: 'quick_navigation'
                  });
                }}
              >
                {category}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Sections */}
        {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
          <section key={category} id={category.toLowerCase()} className="mb-12">
            <h2 className="text-2xl font-playfair font-semibold text-black mb-6">
              {category === 'Support' ? 'Customer Support' : category === 'Ordering' ? 'Ordering & Shipping' : category}
            </h2>
            
            <div className="space-y-4">
              {categoryFaqs.map((faq) => (
                <div key={faq.index} className="glass-card overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.index)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 text-lg pr-4">
                      {faq.question}
                    </h3>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                        openIndex === faq.index ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {openIndex === faq.index && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="pt-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Still Need Help Section */}
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-playfair font-semibold text-black mb-4">
            Still Need Help?
          </h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find what you&apos;re looking for? Our customer service team is here to help.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <svg className="w-8 h-8 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-black mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">Get personalized assistance</p>
              <a 
                href="mailto:help.velioranoir@gmail.com" 
                className="text-black hover:underline font-medium"
                onClick={() => {
                  analytics.trackEvent('faq_email_click', {
                    source: 'faq_page',
                    user_intent: 'direct_support'
                  });
                }}
              >
                help.velioranoir@gmail.com
              </a>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <svg className="w-8 h-8 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="font-semibold text-black mb-2">Contact Form</h3>
              <p className="text-sm text-gray-600 mb-3">Detailed inquiries welcome</p>
              <Link 
                href="/contact" 
                className="text-black hover:underline font-medium"
                onClick={() => {
                  analytics.trackEvent('faq_contact_form_click', {
                    source: 'faq_page',
                    user_intent: 'detailed_inquiry'
                  });
                }}
              >
                Send Message
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections" className="btn-primary">
              Browse Collection
            </Link>
            <Link href="/about" className="btn-secondary">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}