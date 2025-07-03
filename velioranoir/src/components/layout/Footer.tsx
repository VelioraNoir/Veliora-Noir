// src/components/layout/Footer.tsx
import Link from 'next/link';

const Footer = () => {
  const footerSections = [
    {
      title: 'Collections',
      links: [
        { name: 'Rings', href: '/collections/rings' },
        { name: 'Necklaces', href: '/collections/necklaces' },
        { name: 'Bracelets', href: '/collections/bracelets' },
        { name: 'Earrings', href: '/collections/earrings' },
        { name: 'New Arrivals', href: '/collections/new' },
      ],
    },
    {
      title: 'Customer Care',
      links: [
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'Care Instructions', href: '/care' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns & Exchanges', href: '/returns' },
        { name: 'Warranty', href: '/warranty' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Craftsmanship', href: '/craftsmanship' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Press', href: '/press' },
        { name: 'Careers', href: '/careers' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Track Order', href: '/track' },
        { name: 'Book Consultation', href: '/consultation' },
        { name: 'Store Locator', href: '/stores' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/velioranoir',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.324C5.901 8.246 7.052 7.756 8.349 7.756s2.448.49 3.324 1.297c.807.876 1.297 2.027 1.297 3.324s-.49 2.448-1.297 3.324c-.876.807-2.027 1.297-3.324 1.297zm7.098 0c-1.297 0-2.448-.49-3.324-1.297-.807-.876-1.297-2.027-1.297-3.324s.49-2.448 1.297-3.324c.876-.807 2.027-1.297 3.324-1.297s2.448.49 3.324 1.297c.807.876 1.297 2.027 1.297 3.324s-.49 2.448-1.297 3.324c-.876.807-2.027 1.297-3.324 1.297z"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/velioranoir',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/velioranoir',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
    {
      name: 'Pinterest',
      href: 'https://pinterest.com/velioranoir',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017.001z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-metallic-charcoal-900 via-metallic-charcoal-800 to-metallic-charcoal-900 text-metallic-platinum-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-metallic-gold-400 to-metallic-gold-600 rounded-full flex items-center justify-center">
                <span className="text-white font-playfair font-bold text-xl">VN</span>
              </div>
              <div>
                <h3 className="font-playfair text-xl font-medium text-metallic-platinum-100">
                  Veliora Noir
                </h3>
                <p className="text-sm text-metallic-platinum-400">
                  Luxury Metallics
                </p>
              </div>
            </div>
            
            <p className="text-metallic-platinum-300 leading-relaxed">
              Crafting timeless metallic accessories with unparalleled attention to detail and sophisticated elegance.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-metallic-charcoal-700 hover:bg-metallic-gold-500 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-playfair text-lg font-medium text-metallic-platinum-100">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-metallic-platinum-300 hover:text-metallic-gold-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-metallic-charcoal-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-playfair text-xl font-medium text-metallic-platinum-100 mb-2">
                Stay Updated
              </h4>
              <p className="text-metallic-platinum-300">
                Get notified about new collections, exclusive offers, and craftsmanship insights.
              </p>
            </div>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-metallic-charcoal-700 border border-metallic-charcoal-600 rounded-full text-metallic-platinum-200 placeholder-metallic-platinum-400 focus:outline-none focus:ring-2 focus:ring-metallic-gold-500 focus:border-transparent"
              />
              <button className="px-8 py-3 bg-metallic-gold-500 hover:bg-metallic-gold-400 text-metallic-charcoal-900 font-medium rounded-full transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-metallic-charcoal-700">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-metallic-platinum-400">
              <p>&copy; 2024 Veliora Noir. All rights reserved.</p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="hover:text-metallic-gold-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-metallic-gold-400 transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-metallic-gold-400 transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-metallic-platinum-400">We accept:</span>
              <div className="flex space-x-2">
                {['Visa', 'Mastercard', 'AmEx', 'PayPal'].map((method) => (
                  <div
                    key={method}
                    className="w-8 h-6 bg-metallic-platinum-200 rounded text-xs flex items-center justify-center text-metallic-charcoal-800 font-medium"
                  >
                    {method.slice(0, 2)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;