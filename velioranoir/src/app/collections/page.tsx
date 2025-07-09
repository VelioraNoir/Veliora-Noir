import Link from 'next/link';
import Image from 'next/image';
import NewsletterSignup from '../../components/ui/NewsletterSignup';

export default function Collections() {
  const collections = [
    {
      name: 'Rings',
      href: '/collections/rings',
      description: 'Elegant bands and statement pieces',
      image: '/images/ring.png'
    },
    {
      name: 'Necklaces', 
      href: '/collections/necklaces',
      description: 'Sophisticated chains and pendants',
      image: '/images/necklace.png'
    },
    {
      name: 'Bracelets',
      href: '/collections/bracelets', 
      description: 'Refined wrist accessories',
      image: '/images/bracelet.png'
    },
    {
      name: 'Earrings',
      href: '/collections/earrings',
      description: 'Statement and subtle pieces',
      image: '/images/earring.png'
    }
  ];

  return (
    <main className="relative bg-white min-h-screen">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-8 pt-8">
        <ol className="list-reset flex text-gray-500">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-gray-900">Collections</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-semibold tracking-tight text-black mb-6">
            Collections
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore our curated selection of metallic accessories, each piece crafted with precision and elegance.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <Link 
                key={collection.name}
                href={collection.href}
                className="group block"
              >
                <div className="product-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
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

      {/* Newsletter Section */}
    <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
            <NewsletterSignup source="homepage" />
        </div>
    </section>
    </main>
  );
}
