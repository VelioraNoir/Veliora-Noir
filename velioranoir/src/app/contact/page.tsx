'use client';

import { useEffect } from 'react';
import { analytics } from '../../lib/analytics';

export default function Contact() {
  useEffect(() => {
    analytics.pageView('Contact', 'page');
  }, []);

  return (
    <main className="relative bg-white min-h-screen pt-28">
      {/* Hero Section */}
      <section className="px-8 pb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-playfair font-bold tracking-tight text-black mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-12">
            Have questions about our collections or need assistance? We&apos;re here to help.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-8 pb-20">
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-2xl font-playfair font-semibold text-black">
            Get in Touch
          </h3>
          <p className="text-gray-700">
            <strong>Email:</strong>{' '}
            <a href="mailto:help.velioranoir@gmail.com" className="text-yellow-600 hover:underline">
              help.velioranoir@gmail.com
            </a>
          </p>
          <p className="text-gray-700">
            We’re currently setting up a more robust way to handle contact.
            In the meantime, please email us at{' '}
            <a href="mailto:help.velioranoir@gmail.com" className="text-yellow-600 hover:underline">
              help.velioranoir@gmail.com
            </a>{' '}
            and we’ll get back to you as soon as possible.
          </p>
        </div>
      </div>
    </main>
  );
}
