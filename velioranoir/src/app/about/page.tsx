// src/app/about/page.tsx
export default function About() {
  return (
    <main className="relative bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-semibold tracking-tight text-black mb-6">
            About Veliora Noir
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Where metallic artistry meets contemporary elegance
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-black mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Founded on the principles of exceptional craftsmanship and timeless design, 
                Veliora Noir represents the intersection of traditional metalworking techniques 
                and contemporary aesthetic vision.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Each piece in our collection is meticulously crafted to embody sophistication, 
                elegance, and the enduring beauty of precious metals.
              </p>
            </div>
            <div className="aspect-square bg-gray-100 rounded-2xl">
              {/* Placeholder for brand image */}
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-black mb-4">Craftsmanship</h3>
              <p className="text-gray-600">
                Every piece is handcrafted with precision and attention to detail, 
                ensuring exceptional quality and finish.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-black mb-4">Design</h3>
              <p className="text-gray-600">
                Our designs blend timeless elegance with contemporary innovation, 
                creating pieces that transcend trends.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-black mb-4">Materials</h3>
              <p className="text-gray-600">
                We source only the finest metals and materials, ensuring longevity 
                and lustrous beauty in every piece.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="glass-card p-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-black mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-600 mb-8">
              Have questions about our collections or need assistance? 
              We're here to help you find the perfect piece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Contact Us
              </button>
              <button className="btn-secondary">
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}