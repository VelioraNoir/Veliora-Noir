// src/components/ui/NewsletterSignup.tsx - REPLACE ENTIRE FILE
'use client';

import { useState } from 'react';
import { analytics } from '../../lib/analytics';

interface NewsletterSignupProps {
  className?: string;
  title?: string;
  description?: string;
  source?: string; // Track where signup came from
}

export default function NewsletterSignup({ 
  className = "",
  title = "Stay In Touch",
  description = "Be the first to know about new collections and exclusive offers.",
  source = "homepage"
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      
      // Track failed validation
      analytics.trackEvent('newsletter_validation_error', {
        error_type: 'invalid_email',
        source: source
      });
      return;
    }

    setStatus('loading');

    // Track newsletter signup attempt
    analytics.trackEvent('newsletter_signup_attempt', {
      source: source,
      email_domain: email.split('@')[1] || 'unknown'
    });

    try {
      // Call our Klaviyo API endpoint
      const response = await fetch('/api/klaviyo-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: `website_newsletter_${source}`,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Welcome to our exclusive community!');
        
        // Track successful newsletter signup with all platforms
        analytics.newsletterSignup(email, source);
        
        // Additional presale-specific tracking
        analytics.presaleInterest(email, source);
        
        // Track conversion value for luxury brand
        analytics.trackEvent('newsletter_conversion', {
          source: source,
          customer_lifetime_value: 250, // Estimated CLV for luxury jewelry
          conversion_type: 'email_signup'
        });

        setEmail('');
      } else {
        throw new Error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus('error');
      
      // Track signup errors for optimization
      analytics.trackEvent('newsletter_signup_error', {
        error_message: error instanceof Error ? error.message : 'unknown_error',
        source: source,
        email_domain: email.split('@')[1] || 'unknown'
      });
      
      if (error instanceof Error && error.message.includes('already subscribed')) {
        setMessage('You\'re already subscribed! Check your email for updates.');
        
        // Track existing subscriber attempts
        analytics.trackEvent('newsletter_existing_subscriber', {
          source: source,
          email_domain: email.split('@')[1] || 'unknown'
        });
      } else {
        setMessage('Something went wrong. Please try again or email us directly.');
      }
    }
  };

  const trackInputFocus = () => {
    analytics.trackEvent('newsletter_input_focus', {
      source: source,
      engagement_level: 'high_intent'
    });
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
            <div className="mt-4 space-y-2 text-xs text-green-600">
              <p>✨ You&apos;ll receive exclusive presale access</p>
              <p>🚀 Be first to know about our July 10th launch</p>
              <p>💎 Special member-only offers and content</p>
            </div>
            <button 
              onClick={() => {
                setStatus('idle');
                analytics.trackEvent('newsletter_signup_another', {
                  source: source,
                  user_type: 'multi_subscriber'
                });
              }}
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
              onFocus={trackInputFocus}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
              disabled={status === 'loading'}
              required
              data-luxury-action="email_input_focus"
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className={`btn-gold whitespace-nowrap px-8 py-4 ${
                status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              data-luxury-action="newsletter_subscribe"
              onClick={() => {
                analytics.trackEvent('newsletter_subscribe_click', {
                  source: source,
                  email_provided: !!email
                });
              }}
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
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{message}</p>
            </div>
          )}
          
          <div className="mt-4 space-y-2 text-xs text-gray-500">
            <p>Join our exclusive list for presale access on July 10th</p>
            <p>Unsubscribe anytime • We respect your privacy</p>
          </div>
        </form>
      )}
    </div>
  );
}