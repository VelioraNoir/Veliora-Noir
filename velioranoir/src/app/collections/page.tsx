// src/app/collections/page.tsx
import Link from 'next/link';

export default function Collections() {
  const collections = [
    {
      name: 'Rings',
      href: '/collections/rings',
      description: 'Elegant bands and statement pieces',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=400&fit=crop&crop=center'
    },
    {
      name: 'Necklaces', 
      href: '/collections/necklaces',
      description: 'Sophisticated chains and pendants',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop&crop=center'
    },
    {
      name: 'Bracelets',
      href: '/collections/bracelets', 
      description: 'Refined wrist accessories',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=400&fit=crop&crop=center'
    },
    {
      name: 'Earrings',
      href: '/collections/earrings',
      description: 'Statement and subtle pieces',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=400&fit=crop&crop=center'
    }
  ];

  return (
    <main className="relative bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-semibold tracking-tight text-black mb-6">
            Collections
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore our curated selection of metallic accessories, 
            each piece crafted with precision and elegance.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <Link 
                key={collection.name}
                href={collection.href}
                className="group block"
              >
                <div className="product-card rounded-2xl overflow-hidden">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                  </div>
                  <div className="p-8">
                    <h2 className="text-2xl font-semibold tracking-tight text-black mb-2">
                      {collection.name}
                    </h2>
                    <p className="text-gray-600">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}