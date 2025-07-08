import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-8 py-16 space-y-12">
        <h1 className="text-4xl font-playfair font-bold text-center">Terms of Service</h1>
        <p className="text-sm text-gray-600 text-center">Last updated: July 7, 2025</p>

        {/* 1. Our Services */}
        <section id="services" className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Our Services</h2>
          <p>
            Veliora Noir LLC provides an online retail platform offering premium metallic jewelry accessories. Through our website, users can browse products, place orders, and manage their purchases.
          </p>
        </section>

        {/* 2. Intellectual Property Rights */}
        <section id="ip" className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Intellectual Property Rights</h2>
          <p>
            All content on this Site, including text, graphics, logos, images, and software, is the property of Veliora Noir LLC or its licensors and is protected by copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        {/* 3. User Representations */}
        <section id="representations" className="space-y-4">
          <h2 className="text-2xl font-semibold">3. User Representations</h2>
          <p>
            By using our Site, you represent that you are at least 13 years old and, if you are under 18, you have the consent of a parent or legal guardian to use the Site and enter into these Terms. You agree to provide accurate, current, and complete information when creating an account and placing orders.
          </p>
        </section>

        {/* 4. User Registration */}
        <section id="registration" className="space-y-4">
          <h2 className="text-2xl font-semibold">4. User Registration</h2>
          <p>
            You may register for an account to facilitate ordering, view order history, and manage personal information. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
        </section>

        {/* 5. Products */}
        <section id="products" className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Products</h2>
          <p>
            Product descriptions, images, and pricing are provided for informational purposes. We strive for accuracy but do not guarantee that all information is error-free.
          </p>
        </section>

        {/* 6. Purchases and Payment */}
        <section id="purchases" className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Purchases and Payment</h2>
          <p>
            All orders are subject to acceptance and product availability. Payment methods include major credit cards, Shop Pay, PayPal, Apple Pay, and Google Pay. By placing an order, you authorize us to charge the total order amount.
          </p>
        </section>

        {/* 7. Return Policy */}
        <section id="returns" className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Return Policy</h2>
          <p>
            We offer a 30-day return window for unworn items in original packaging. See our <Link href="/returns" className="text-yellow-600 hover:underline">Returns Policy</Link> for full details.
          </p>
        </section>

        {/* 8. Prohibited Activities */}
        <section id="prohibited" className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Prohibited Activities</h2>
          <p>
            You agree not to engage in unlawful conduct, data scraping, unauthorized access attempts, or other activities that harm the Site or its users.
          </p>
        </section>

        {/* 9. User Generated Contributions */}
        <section id="ugc" className="space-y-4">
          <h2 className="text-2xl font-semibold">9. User Generated Contributions</h2>
          <p>
            Any comments, reviews, or other content you post become non-confidential and non-proprietary. We may use or remove user contributions at our discretion.
          </p>
        </section>

        {/* 10. Contribution License */}
        <section id="license" className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Contribution License</h2>
          <p>
            By submitting content, you grant Veliora Noir LLC a perpetual, irrevocable, royalty-free license to use, reproduce, and display your contributions.
          </p>
        </section>

        {/* 11. Services Management */}
        <section id="management" className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Services Management</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of the Site or services without notice.
          </p>
        </section>

        {/* 12. Privacy Policy */}
        <section id="privacy" className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Privacy Policy</h2>
          <p>
            Your use of the Site is also governed by our <Link href="/privacy-policy" className="text-yellow-600 hover:underline">Privacy Policy</Link>, which covers how we collect and use personal data.
          </p>
        </section>

        {/* 13. Term and Termination */}
        <section id="termination" className="space-y-4">
          <h2 className="text-2xl font-semibold">13. Term and Termination</h2>
          <p>
            These Terms are effective upon acceptance and remain in force until terminated by either party. We may terminate or suspend your access at any time for violations.
          </p>
        </section>

        {/* 14. Modifications and Interruptions */}
        <section id="modifications" className="space-y-4">
          <h2 className="text-2xl font-semibold">14. Modifications and Interruptions</h2>
          <p>
            We may update the Site and these Terms from time to time. We are not liable for temporary interruptions in service.
          </p>
        </section>

        {/* 15. Governing Law */}
        <section id="law" className="space-y-4">
          <h2 className="text-2xl font-semibold">15. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Hawaii. Venue for any disputes lies in Honolulu County, Hawaii.
          </p>
        </section>

        {/* 16. Dispute Resolution */}
        <section id="dispute" className="space-y-4">
          <h2 className="text-2xl font-semibold">16. Dispute Resolution</h2>
          <p>
            Parties will attempt informal negotiations for 30 days, then binding arbitration under AAA rules in Honolulu County, Hawaii.
          </p>
        </section>

        {/* 17. Corrections */}
        <section id="corrections" className="space-y-4">
          <h2 className="text-2xl font-semibold">17. Corrections</h2>
          <p>
            We may correct errors, inaccuracies, or omissions on the Site, and update content without notice.
          </p>
        </section>

        {/* 18. Disclaimer */}
        <section id="disclaimer" className="space-y-4">
          <h2 className="text-2xl font-semibold">18. Disclaimer</h2>
          <p>
            THE SITE AND PRODUCTS ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY AND FITNESS FORA PURPOSE.
          </p>
        </section>

        {/* 19. Limitations of Liability */}
        <section id="liability" className="space-y-4">
          <h2 className="text-2xl font-semibold">19. Limitations of Liability</h2>
          <p>
            OUR TOTAL LIABILITY IS LIMITED TO THE AMOUNT YOU PAID FOR PRODUCTS PURCHASED IN THE 12 MONTHS PRIOR TO THE EVENT GIVING RISE TO THE CLAIM.
          </p>
        </section>

        {/* 20. Indemnification */}
        <section id="indemnification" className="space-y-4">
          <h2 className="text-2xl font-semibold">20. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Veliora Noir LLC and its officers, directors, employees, and agents from any claims arising from your breach of these Terms or your misuse of the Site.
          </p>
        </section>

        {/* 21. User Data */}
        <section id="user-data" className="space-y-4">
          <h2 className="text-2xl font-semibold">21. User Data</h2>
          <p>
            We will not rent or sell personal data. All user data is processed in accordance with our Privacy Policy.
          </p>
        </section>

        {/* 22. Electronic Communications */}
        <section id="electronic" className="space-y-4">
          <h2 className="text-2xl font-semibold">22. Electronic Communications</h2>
          <p>
            By using the Site, you consent to receive electronic communications from us (emails, push notifications) regarding your account and transactions.
          </p>
        </section>

        {/* 23. California Users and Residents */}
        <section id="california" className="space-y-4">
          <h2 className="text-2xl font-semibold">23. California Users and Residents</h2>
          <p>
            If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA).
          </p>
        </section>

        {/* 24. Miscellaneous */}
        <section id="miscellaneous" className="space-y-4">
          <h2 className="text-2xl font-semibold">24. Miscellaneous</h2>
          <p>
            These Terms constitute the entire agreement and supersede prior agreements. No waiver by us of any breach is a waiver of any subsequent breach.
          </p>
        </section>

        {/* 25. Entire Agreement */}
        <section id="entire-agreement" className="space-y-4">
          <h2 className="text-2xl font-semibold">25. Entire Agreement</h2>
          <p>
            These Terms, along with our Privacy Policy, Returns Policy, and any documents expressly incorporated, constitute the entire agreement between you and Veliora Noir LLC.
          </p>
        </section>

        {/* 26. Force Majeure */}
        <section id="force-majeure" className="space-y-4">
          <h2 className="text-2xl font-semibold">26. Force Majeure</h2>
          <p>
            Neither party is liable for delays or failures due to events outside their reasonable control, including natural disasters, pandemics, or interruptions in internet.
          </p>
        </section>

        {/* 27. Feedback License */}
        <section id="feedback" className="space-y-4">
          <h2 className="text-2xl font-semibold">27. Feedback License</h2>
          <p>
            By providing feedback, you grant Veliora Noir LLC a perpetual, unrestricted license to use and commercialize your suggestions.
          </p>
        </section>

        {/* 28. Severability & Waiver */}
        <section id="severability" className="space-y-4">
          <h2 className="text-2xl font-semibold">28. Severability & Waiver</h2>
          <p>
            If any provision is held invalid, the remainder of these Terms will remain in effect. No waiver by us is a waiver of future rights.
          </p>
        </section>

        {/* 29. Contact Us */}
        <section id="contact" className="space-y-4">
          <h2 className="text-2xl font-semibold">29. Contact Us</h2>
          <p>
            Business Address: 95-435 Kaawela Place, HI 96789, Mililani, HI
          </p>
          <p>Phone: 808-304-8860</p>
          <p>Email: <a href="mailto:help.velioranoir@gmail.com" className="text-yellow-600 hover:underline">help.velioranoir@gmail.com</a></p>
        </section>
      </div>
    </main>
  );
}
