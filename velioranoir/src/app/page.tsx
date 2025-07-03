// src/app/page.tsx
import { getAllProducts, Product } from '../lib/shopify';

export default async function Home() {
  const products: Product[] = await getAllProducts();

  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-hero text-metallic-gradient mb-6 animate-fade-in-up">
            Velio Ranoir
          </h1>
          <p className="text-xl text-metallic-charcoal-600 dark:text-metallic-platinum-300 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Discover our exquisite collection of handcrafted metallic accessories, 
            where timeless elegance meets contemporary sophistication.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-up delay-300">
            <button className="btn-metallic-primary focus-metallic">
              Explore Collection
            </button>
            <button className="btn-metallic-outline focus-metallic">
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-display text-metallic-charcoal-800 dark:text-metallic-platinum-200 mb-4">
              Featured Accessories
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-metallic-gold-400 to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="product-card rounded-2xl overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="product-card-image aspect-square relative">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Metallic overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-metallic-silver-200/0 to-metallic-gold-200/0 hover:from-metallic-silver-200/20 hover:to-metallic-gold-200/20 transition-all duration-500" />
                  
                  {/* Quick view button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <button className="btn-metallic-gold text-sm px-6 py-3">
                      Quick View
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-playfair text-lg font-medium text-metallic-charcoal-800 dark:text-metallic-platinum-200 mb-2">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold text-metallic-gold-500">
                      ${product.variants[0].price}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className="w-4 h-4 text-metallic-gold-400" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-metallic-silver-100 to-metallic-platinum-100 hover:from-metallic-silver-200 hover:to-metallic-platinum-200 text-metallic-charcoal-800 rounded-full font-medium transition-all duration-300 focus-metallic">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-16">
            <button className="btn-metallic-outline">
              View All Accessories
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center">
            <h3 className="font-playfair text-heading text-metallic-charcoal-800 dark:text-metallic-platinum-200 mb-4">
              Stay In Touch
            </h3>
            <p className="text-metallic-charcoal-600 dark:text-metallic-platinum-400 mb-8">
              Be the first to know about new collections and exclusive offers.
            </p>
            <div className="flex max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/50 dark:bg-metallic-charcoal-800/50 border border-metallic-silver-200/50 focus-metallic text-metallic-charcoal-800 dark:text-metallic-platinum-200 placeholder-metallic-charcoal-500"
              />
              <button className="btn-metallic-gold whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}