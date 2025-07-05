// src/components/ui/NewsletterSignup.tsx - REPLACE ENTIRE FILE
'use client';

import { useState } from 'react';

interface NewsletterSignupProps {
  className?: string;
  title?: string;
  description?: string;
}

export default function NewsletterSignup({ 
  className = "",
  title = "Stay In Touch",
  description = "Be the first to know about new collections and exclusive offers."
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      // Klaviyo API Integration
      const response = await fetch('/api/klaviyo-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'website_newsletter',
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you! You\'re now subscribed to our newsletter.');
        setEmail('');
        
        // Track successful signup
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_signup', {
            event_category: 'engagement',
            event_label: 'homepage'
          });
        }
      } else {
        throw new Error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={`glass-card p-12 text-center ${className}`}>
      <h3 className="text-3xl font-playfair font-semibold tracking-tight text-black mb-4">
        {title}
      </h3>
      <p className="text-gray-600 mb-8">
        {description}
      </p>

      {status === 'success' ? (
        <div className="max-w-md mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h4 className="font-medium text-green-900 mb-2">Welcome to Veliora Noir!</h4>
            <p className="text-green-700 text-sm">{message}</p>
            <p className="text-green-600 text-xs mt-2">You'll be the first to know about our July 10th presale!</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-4 text-sm text-green-600 hover:text-green-700 underline"
            >
              Subscribe another email
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
              disabled={status === 'loading'}
              required
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className={`btn-gold whitespace-nowrap px-8 py-4 ${
                status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {status === 'loading' ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Subscribing...
                </div>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>
          
          {status === 'error' && (
            <p className="mt-4 text-red-600 text-sm">{message}</p>
          )}
          
          <p className="mt-4 text-xs text-gray-500">
            Join our exclusive list for presale access. Unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  );
}