// src/app/collections/bracelets/page.tsx
export default function Bracelets() {
  return (
    <main className="relative bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-semibold tracking-tight text-black mb-6">
            Bracelets
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Refined wrist accessories that combine metallic artistry 
            with modern elegance and timeless style.
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <h2 className="text-3xl font-semibold tracking-tight text-black mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-8">
              Our bracelet collection showcases intricate metalwork 
              and contemporary design in perfect harmony.
            </p>
            <button className="btn-secondary">
              Notify Me
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}