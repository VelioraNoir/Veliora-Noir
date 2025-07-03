// src/app/collections/necklaces/page.tsx
export default function Necklaces() {
  return (
    <main className="relative bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-semibold tracking-tight text-black mb-6">
            Necklaces
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Elegant chains and pendants that grace the neckline with 
            timeless beauty and contemporary appeal.
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
              Our necklace collection features sophisticated designs 
              crafted from the finest metallic materials.
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