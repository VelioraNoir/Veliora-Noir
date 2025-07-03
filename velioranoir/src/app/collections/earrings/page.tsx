// src/app/collections/earrings/page.tsx
export default function Earrings() {
  return (
    <main className="relative bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-semibold tracking-tight text-black mb-6">
            Earrings
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            From subtle studs to statement drops, our earring collection 
            adds the perfect finishing touch to any ensemble.
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
              Our earring collection features geometric designs and 
              organic forms in premium metallic finishes.
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