// src/app/page.tsx
import { getAllProducts, Product } from '../lib/shopify';

export default async function Home() {
  const products: Product[] = await getAllProducts();

  return (
    <main className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p.id} className="group bg-white rounded-xl shadow hover:shadow-lg overflow-hidden">
          <img
            src={p.images[0]}
            alt={p.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
          />
          <div className="p-4">
            <h2 className="font-semibold text-lg">{p.title}</h2>
            {/* ← Here’s where you render the price: */}
            <p>${p.variants[0].price}</p>
          </div>
        </div>
      ))}
    </main>
  );
}
