'use client';

import { useEffect } from 'react';
import { analytics } from '../../lib/analytics';

export default function PrivacyPolicy() {
  useEffect(() => {
    analytics.pageView('Privacy Policy', 'policy');
  }, []);

  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-8 py-16 space-y-8">
        <h1 className="text-4xl font-playfair font-bold text-center">Privacy Policy</h1>
        <p className="text-sm text-gray-600 text-center">Last updated: July 7, 2025</p>

        {/* 1. Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            Veliora Noir LLC (“we”, “our”, “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (<strong>velioranoir.com</strong>) or make a purchase.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <h3 className="font-semibold">Personal Information You Provide</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Name, email address, billing & shipping address</li>
            <li>Payment information (processed securely by Shopify Payments and PayPal)</li>
            <li>Account credentials when you register</li>
            <li>Customer service correspondence and reviews</li>
          </ul>
          <h3 className="font-semibold mt-4">Automatically Collected Data</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Device and browser information</li>
            <li>IP address, geolocation data</li>
            <li>Pages visited, time spent, click behavior</li>
          </ul>
          <h3 className="font-semibold mt-4">Cookies & Tracking</h3>
          <p className="text-gray-700">
            We use cookies and similar technologies (Web beacons, local storage) to improve your experience, analyze site usage, and support advertising. You can manage cookie settings in your browser; disabling them may limit functionality.
          </p>
        </section>

        {/* 3. How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Process and fulfill orders, manage payments</li>
            <li>Communicate updates, promotions, and support</li>
            <li>Personalize content and product recommendations</li>
            <li>Improve and optimize our site and services</li>
            <li>Comply with legal obligations and prevent fraud</li>
          </ul>
        </section>

        {/* 4. Sharing Your Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Sharing Your Information</h2>
          <p className="text-gray-700">
            We share your data only as necessary with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Service providers (payment processors, shipping carriers, analytics)</li>
            <li>Legal authorities when required by law or to protect rights</li>
            <li>Successors and assigns in the event of a merger or acquisition</li>
          </ul>
        </section>

        {/* 5. Third-Party Services */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Third-Party Services</h2>
          <p className="text-gray-700">
            Our website may link to third-party sites (social media, payment gateways). We are not responsible for their privacy practices. Review their policies before sharing personal data.
          </p>
        </section>

        {/* 6. Data Retention */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Data Retention</h2>
          <p className="text-gray-700">
            We retain personal information only as long as necessary to fulfill the purposes outlined here, comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>
        </section>

        {/* 7. Security */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Security</h2>
          <p className="text-gray-700">
            We implement industry-standard controls (encryption, access restrictions) to protect your data. However, no Internet transmission is 100% secure.
          </p>
        </section>

        {/* 8. Your Rights */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Your Rights</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Access, correct, or delete your personal data</li>
            <li>Object to or restrict processing</li>
            <li>Withdraw consent where applicable</li>
            <li>Receive a copy of your data in a portable format</li>
          </ul>
          <p className="text-gray-700">
            To exercise your rights, contact us at <a href="mailto:help.velioranoir@gmail.com" className="text-yellow-600 hover:underline">help.velioranoir@gmail.com</a>.
          </p>
        </section>

        {/* 9. Children’s Privacy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Children’s Privacy</h2>
          <p className="text-gray-700">
            Our platform is not intended for use by children under 13. We do not knowingly collect personal information from anyone under 13. If you are under 13, please obtain parental consent before providing any personal information.
          </p>
        </section>

        {/* 10. International Transfers */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. International Transfers</h2>
          <p className="text-gray-700">
            We may transfer your information to countries with different data protection laws. We will ensure adequate safeguards are in place.
          </p>
        </section>

        {/* 11. Changes to this Policy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Changes to this Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will post updates here and revise the &quot;Last updated&quot; date.
          </p>
        </section>

        {/* 12. Contact Us */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this policy, contact us at:
          </p>
          <p className="text-gray-700">Veliora Noir LLC<br />95-435 Kaawela Place<br />Mililani, HI 96789<br />Phone: 808-304-8860<br /><a href="mailto:help.velioranoir@gmail.com" className="text-yellow-600 hover:underline">help.velioranoir@gmail.com</a></p>
        </section>
      </div>
    </main>
  );
}
