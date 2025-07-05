// src/app/contact/page.tsx - REPLACE ENTIRE FILE
'use client';

import ContactForm from '../../components/ui/ContactForm';

export default function Contact() {
  return (
    <main className="relative bg-white min-h-screen pt-28">
      {/* Hero Section */}
      <section className="px-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-playfair font-bold tracking-tight text-black mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have questions about our collections or need assistance? 
            We're here to help you find the perfect piece.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ContactForm />

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-xl font-playfair font-semibold text-black mb-6">
                Get in Touch
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Email</h4>
                    <p className="text-gray-600">hello@velioranoir.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Business Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9AM - 6PM EST</p>
                    <p className="text-sm text-gray-500">Closed on weekends</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Studio Location</h4>
                    <p className="text-gray-600">New York, NY</p>
                    <p className="text-sm text-gray-500">By appointment only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-playfair font-semibold text-black mb-6">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900 py-2">
                    When does the presale start?
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="text-gray-600 mt-2">
                    Our presale launches July 10th at 12pm PST / 9am HST. Newsletter subscribers get early access and exclusive pricing.
                  </p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900 py-2">
                    Do you offer custom sizing?
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="text-gray-600 mt-2">
                    Yes! We offer custom sizing for rings and adjustable options for other pieces. Contact us with your measurements for a personalized quote.
                  </p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900 py-2">
                    What materials do you use?
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="text-gray-600 mt-2">
                    We work with premium metals including sterling silver, gold-filled, and platinum. All pieces are nickel-free and hypoallergenic.
                  </p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900 py-2">
                    What's your return policy?
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="text-gray-600 mt-2">
                    We offer a 30-day return policy for unworn items in original condition. Custom pieces are final sale unless there's a manufacturing defect.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}