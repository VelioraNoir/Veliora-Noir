// src/components/ui/ContactForm.tsx - CREATE THIS NEW FILE
'use client';

import { useState } from 'react';

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
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please enter your message');
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

    try {
      // Using same Formspree setup as newsletter (replace YOUR_CONTACT_FORM_ID)
      const response = await fetch('https://formspree.io/f/YOUR_CONTACT_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || `${formData.inquiryType} inquiry from ${formData.name}`,
          message: formData.message,
          inquiryType: formData.inquiryType,
          phone: formData.phone,
          source: 'website_contact_form',
          timestamp: new Date().toISOString(),
          // Add some context for your inbox
          _subject: `New ${formData.inquiryType} inquiry from ${formData.name}`,
        }),
      });

      if (response.ok) {
        setStatus('success');
        
        // Track successful contact form submission
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'contact_form_submit', {
            event_category: 'engagement',
            event_label: formData.inquiryType
          });
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or email us directly.');
    }
  };

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
            Message Sent Successfully
          </h3>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• We'll review your {formData.inquiryType} inquiry</li>
              <li>• Expect a personalized response within 24 hours</li>
              <li>• For sizing questions, we'll provide a detailed guide</li>
            </ul>
          </div>
          <button 
            onClick={resetForm}
            className="mt-6 btn-secondary"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="Your name"
              disabled={status === 'loading'}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="your@email.com"
              disabled={status === 'loading'}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="+1 (555) 123-4567"
            disabled={status === 'loading'}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900"
            disabled={status === 'loading'}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="Brief subject line"
            disabled={status === 'loading'}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-500"
            placeholder="Tell us how we can help you..."
            disabled={status === 'loading'}
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