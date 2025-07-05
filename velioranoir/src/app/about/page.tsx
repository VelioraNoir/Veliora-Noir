// src/app/about/page.tsx - REPLACE ENTIRE FILE
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function About() {
  const [activeValue, setActiveValue] = useState(0);

  const brandValues = [
    {
      title: "Curated Excellence",
      description: "Every piece in our collection is carefully selected for its exceptional design, quality, and timeless appeal.",
      icon: "🔍"
    },
    {
      title: "Accessible Luxury",
      description: "We believe luxury should be attainable. Our curated selection offers premium styling at accessible prices.",
      icon: "✨"
    },
    {
      title: "Effortless Elegance",
      description: "From selection to delivery, we've designed every touchpoint to be as elegant as the jewelry itself.",
      icon: "💫"
    },
    {
      title: "Customer Obsessed",
      description: "Your satisfaction is our priority. We're here to help you find the perfect piece for every occasion.",
      icon: "💎"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Curated Pieces" },
    { number: "50+", label: "Countries Served" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  return (
    <main className="relative bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8 text-center bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-playfair font-bold tracking-tight text-black mb-6 animate-fade-in-up">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8 animate-fade-in-up delay-200">
            Veliora Noir was born from a simple belief: luxury jewelry should be 
            accessible, authentic, and effortlessly elegant.
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto animate-fade-in-up delay-300" />
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-playfair font-bold text-black mb-6">
                A Vision for Modern Luxury
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  In a world where luxury often feels distant and exclusive, we saw an opportunity 
                  to create something different. Veliora Noir began as a vision to curate exceptional 
                  jewelry pieces that embody sophistication without compromise.
                </p>
                <p>
                  Our name reflects our mission: "Veliora" - to unveil beauty, and "Noir" - 
                  the timeless elegance of classic design. Together, they represent our commitment 
                  to revealing the extraordinary in every piece we select.
                </p>
                <p>
                  We believe that luxury isn't about exclusivity—it's about excellence. 
                  Every piece in our collection has been thoughtfully chosen to meet our 
                  exacting standards for design, quality, and enduring appeal.
                </p>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up delay-200">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center"
                  alt="Luxury jewelry collection"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full opacity-20 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-black mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our values guide every decision we make, from curation to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {brandValues.map((value, index) => (
              <div 
                key={index}
                className={`glass-card p-8 text-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  activeValue === index ? 'ring-2 ring-black' : ''
                }`}
                onClick={() => setActiveValue(index)}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-playfair font-semibold text-black mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-playfair font-bold text-black mb-12">
            Trusted by Jewelry Lovers Worldwide
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl lg:text-5xl font-playfair font-bold text-black mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative animate-fade-in-up">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=450&fit=crop&crop=center"
                  alt="Luxury shopping experience"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full opacity-10 animate-pulse" />
            </div>

            <div className="animate-fade-in-up delay-200">
              <h2 className="text-4xl font-playfair font-bold text-black mb-6">
                The Veliora Noir Experience
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  From the moment you discover our collection to the day your piece arrives, 
                  we've designed every interaction to reflect the luxury you deserve.
                </p>
                <p>
                  Our innovative 3D viewer lets you explore each piece in stunning detail, 
                  while our customer service team is always ready to help you find exactly 
                  what you're looking for.
                </p>
                
                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Curated Selection</h4>
                      <p className="text-sm text-gray-600">Every piece meets our exacting standards for design and quality</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Secure Shopping</h4>
                      <p className="text-sm text-gray-600">Your purchase is protected with secure payment processing</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Customer Care</h4>
                      <p className="text-sm text-gray-600">Dedicated support team ready to assist with any questions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-playfair font-bold text-white">VN</span>
            </div>
            
            <h2 className="text-3xl font-playfair font-bold text-black mb-6">
              A Personal Note
            </h2>
            
            <div className="space-y-6 text-gray-600 leading-relaxed max-w-2xl mx-auto">
              <p className="text-lg italic">
                "I founded Veliora Noir because I believe everyone deserves to feel confident 
                and beautiful in jewelry that reflects their personal style."
              </p>
              <p>
                Our mission goes beyond simply offering beautiful pieces. We're here to help you 
                discover jewelry that tells your story, celebrates your moments, and makes you 
                feel extraordinary every day.
              </p>
              <p>
                Thank you for being part of our journey. I can't wait to see how our pieces 
                become part of yours.
              </p>
            </div>
            
            <div className="mt-8">
              <p className="font-playfair font-semibold text-black text-lg">
                The Veliora Noir Team
              </p>
              <p className="text-sm text-gray-500 mt-1">Founders & Curators</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-black mb-4">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Veliora Noir
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What makes Veliora Noir different?",
                answer: "We focus on curating exceptional pieces that offer luxury styling at accessible prices. Every item is selected for its design excellence, quality, and timeless appeal."
              },
              {
                question: "How do you ensure quality?",
                answer: "Our team carefully evaluates each piece against strict quality standards. We work only with trusted suppliers and thoroughly inspect every aspect of design and construction."
              },
              {
                question: "What's your return policy?",
                answer: "We offer a 30-day return policy for unworn items in original packaging. Your satisfaction is our priority, and we'll work with you to ensure you love your purchase."
              },
              {
                question: "Do you offer international shipping?",
                answer: "Yes! We ship worldwide with secure, trackable shipping. Delivery times vary by location, typically 7-14 business days internationally."
              },
              {
                question: "How can I contact customer service?",
                answer: "Our team is available via email at help.velioranoir@gmail.com. We respond within 24 hours and are here to help with any questions or concerns."
              }
            ].map((faq, index) => (
              <details key={index} className="glass-card p-6 group">
                <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900 text-lg">
                  {faq.question}
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <h2 className="text-4xl font-playfair font-bold text-black mb-6">
              Ready to Discover Your Perfect Piece?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Explore our carefully curated collection and find jewelry that speaks to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/collections" className="btn-primary">
                Explore Collection
              </Link>
              <Link href="/contact" className="btn-secondary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}