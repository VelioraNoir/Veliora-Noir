// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const footerSections = [
    {
      title: 'Collections',
      links: [
        { name: 'All Collections', href: '/collections' },
        { name: 'Rings', href: '/collections/rings' },
        { name: 'Necklaces', href: '/collections/necklaces' },
        { name: 'Bracelets', href: '/collections/bracelets' },
        { name: 'Earrings', href: '/collections/earrings' },
      ],
    },
    {
      title: 'Customer Care',
      links: [
        { name: 'Care Instructions', href: '/care', description: 'How to maintain your jewelry' },
        { name: 'Returns Policy', href: '/returns' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq', description: 'Common questions answered' },
        { name: 'About Us', href: '/about' },
        { name: 'Wishlist', href: '/wishlist' },
      ],
    },
  ];

  // Only Instagram remains
    // Instagram + Facebook
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/velioranoir',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.324C5.901 8.246 7.052 7.756 8.349 7.756s2.448.49 3.324 1.297c.807.876 1.297 2.027 1.297 3.324s-.49 2.448-1.297 3.324c-.876.807-2.027 1.297-3.324 1.297zm7.098 0c-1.297 0-2.448-.49-3.324-1.297-.807-.876-1.297-2.027-1.297-3.324s.49-2.448 1.297-3.324c.876-.807 2.027-1.297 3.324-1.297s2.448.49 3.324 1.297c.807.876 1.297 2.027 1.297 3.324s-.49 2.448-1.297 3.324c-.876.807-2.027 1.297-3.324 1.297z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/velioranoir',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];


  const paymentMethods = [
    { name: 'Visa', icon: 'VISA' },
    { name: 'Mastercard', icon: 'MC' },
    { name: 'American Express', icon: 'AMEX' },
    { name: 'PayPal', icon: 'PP' },
    { name: 'Apple Pay', icon: 'AP' },
    { name: 'Google Pay', icon: 'GP' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 relative">
                <Image
                  src="/images/logo.png"
                  alt="Veliora Noir Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-playfair text-xl font-medium text-white">
                  Veliora Noir
                </h3>
                <p className="text-sm text-gray-400">
                  Luxury Metallics
                </p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Crafting timeless metallic accessories with unparalleled attention to detail and sophisticated elegance.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-playfair text-lg font-medium text-white">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 block"
                      title={link.description}
                    >
                      {link.name}
                      {link.description && (
                        <span className="block text-xs text-gray-500 mt-1">
                          {link.description}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-playfair text-xl font-medium text-white mb-2">
                Stay Updated
              </h4>
              <p className="text-gray-300">
                Get notified about new collections, exclusive offers, and craftsmanship insights.
              </p>
            </div>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-gray-700 border border-gray-600 rounded-full text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium rounded-full transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <p>&copy; 2024 Veliora Noir. All rights reserved.</p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="hover:text-yellow-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-yellow-400 transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="/returns" className="hover:text-yellow-400 transition-colors duration-200">
                  Returns Policy
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Secure payments:</span>
              <div className="flex space-x-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="w-10 h-6 bg-white rounded text-xs flex items-center justify-center text-gray-800 font-bold border"
                    title={`Pay with ${method.name}`}
                  >
                    {method.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              All major credit cards and digital wallets accepted • Secure SSL encryption • Shopify Payments
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
