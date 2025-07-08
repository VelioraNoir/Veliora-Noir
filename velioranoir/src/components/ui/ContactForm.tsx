// src/components/ui/ContactForm.tsx - REPLACE ENTIRE FILE
'use client';

import { useState } from 'react';
import { analytics } from '../../lib/analytics';

interface ContactFormProps {
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: string;
  phone?: string;
}

export default function ContactForm({ className = "" }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general',
    phone: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'presale', label: 'Presale Questions' },
    { value: 'sizing', label: 'Sizing & Fit' },
    { value: 'shipping', label: 'Shipping & Returns' },
    { value: 'wholesale', label: 'Wholesale Inquiries' },
    { value: 'press', label: 'Press & Media' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Track form field interactions for luxury customer insights
    if (e.target.name === 'inquiryType') {
      analytics.trackEvent('contact_form_inquiry_type_change', {
        inquiry_type: e.target.value,
        customer_intent: e.target.value === 'wholesale' ? 'high_value' : 'standard'
      });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name');
      analytics.trackEvent('contact_form_validation_error', {
        field: 'name',
        error_type: 'required_field_missing'
      });
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      analytics.trackEvent('contact_form_validation_error', {
        field: 'email',
        error_type: 'invalid_format'
      });
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please enter your message');
      analytics.trackEvent('contact_form_validation_error', {
        field: 'message',
        error_type: 'required_field_missing'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // Track form submission attempt
    analytics.trackEvent('contact_form_submit_attempt', {
      inquiry_type: formData.inquiryType,
      has_phone: !!formData.phone,
      message_length: formData.message.length,
      email_domain: formData.email.split('@')[1] || 'unknown'
    });

    // …inside handleSubmit…
try {
  // Send to our own email endpoint
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  if (!res.ok) throw new Error('Email send failed');

  setStatus('success');
  analytics.contactFormSubmit(formData.inquiryType);

} catch (error) {
  console.error('Contact form error:', error);
  setStatus('error');
  setErrorMessage(
    'Something went wrong. Please try again or email us directly at help.velioranoir@gmail.com'
  );
  analytics.trackEvent('contact_form_submission_error', {
    error_message: error instanceof Error ? error.message : 'unknown_error',
    inquiry_type: formData.inquiryType,
    email_domain: formData.email.split('@')[1] || 'unknown'
  });
}

  };

  // Helper function to get HubSpot cookie
//   const getCookie = (name: string) => {
//     if (typeof document === 'undefined') return null;
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop()?.split(';').shift();
//     return null;
//   };

  // Helper function to calculate customer quality score
//   const calculateCustomerQuality = (data: FormData): number => {
//     let score = 0;
    
//     // Phone number provided (+20 points)
//     if (data.phone) score += 20;
    
//     // Professional email domain (+15 points)
//     if (isProfessionalEmail(data.email)) score += 15;
    
//     // Detailed message (+10 points)
//     if (data.message.length > 100) score += 10;
    
//     // High-value inquiry type (+25 points)
//     if (['wholesale', 'press'].includes(data.inquiryType)) score += 25;
    
//     // Complete form (+10 points)
//     if (data.subject) score += 10;
    
//     return Math.min(score, 100); // Cap at 100
//   };

  // Helper function to detect professional email
//   const isProfessionalEmail = (email: string): boolean => {
//     const domain = email.split('@')[1]?.toLowerCase() || '';
//     const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
//     return !personalDomains.includes(domain);
//   };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      inquiryType: 'general',
      phone: ''
    });
    setStatus('idle');
    setErrorMessage('');
    
    analytics.trackEvent('contact_form_reset', {
      user_action: 'new_inquiry'
    });
  };

  const trackFormEngagement = (field: string) => {
    analytics.trackEvent('contact_form_field_focus', {
      field: field,
      engagement_level: 'active_user'
    });
  };

  if (status === 'success') {
    return (
      <div className={`glass-card p-8 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-playfair font-bold text-black mb-4">
            Message Received
          </h3>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. Our team will respond within 24 hours.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your inquiry has been added to our CRM system</li>
              <li>• You&apos;ll receive a personalized response within 24 hours</li>
              <li>• For urgent matters, email help.velioranoir@gmail.com directly</li>
            </ul>
          </div>
          <button 
            onClick={resetForm}
            className="mt-6 btn-secondary"
            data-luxury-action="contact_form_reset"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-8 ${className}`}>
      <h2 className="text-2xl font-playfair font-semibold text-black mb-6">
        Get In Touch
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              onFocus={() => trackFormEngagement('name')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="Your name"
              disabled={status === 'loading'}
              data-luxury-action="contact_name_input"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              onFocus={() => trackFormEngagement('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="your@email.com"
              disabled={status === 'loading'}
              data-luxury-action="contact_email_input"
            />
          </div>
        </div>

        {/* Phone Number (Optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onFocus={() => trackFormEngagement('phone')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="+1 (555) 123-4567"
            disabled={status === 'loading'}
            data-luxury-action="contact_phone_input"
          />
        </div>

        {/* Inquiry Type */}
        <div>
          <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
            How can we help you?
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            onFocus={() => trackFormEngagement('inquiryType')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900"
            disabled={status === 'loading'}
            data-luxury-action="contact_inquiry_type_select"
          >
            {inquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onFocus={() => trackFormEngagement('subject')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="Brief subject line"
            disabled={status === 'loading'}
            data-luxury-action="contact_subject_input"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleChange}
            onFocus={() => trackFormEngagement('message')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-500"
            placeholder="Tell us how we can help you..."
            disabled={status === 'loading'}
            data-luxury-action="contact_message_input"
          />
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-4 rounded-lg font-medium transition-all duration-200 ${
            status === 'loading' 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
          data-luxury-action="contact_form_submit"
        >
          {status === 'loading' ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending Message...
            </div>
          ) : (
            'Send Message'
          )}
        </button>

        {/* Contact Info Footer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            Need immediate assistance?
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Email: <a href="mailto:help.velioranoir@gmail.com" className="text-black hover:underline">help.velioranoir@gmail.com</a></p>
            <p>Response time: Within 24 hours</p>
          </div>
        </div>
      </form>
    </div>
  );
}