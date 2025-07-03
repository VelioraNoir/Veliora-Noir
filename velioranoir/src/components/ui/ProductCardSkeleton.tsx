export const ProductCardSkeleton = () => {
  return (
    <div className="product-card rounded-2xl overflow-hidden">
      <div className="aspect-square bg-metallic-platinum-200 skeleton"></div>
      <div className="p-6 space-y-4">
        <div className="skeleton h-6 w-3/4"></div>
        <div className="flex justify-between items-center">
          <div className="skeleton h-8 w-20"></div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-4 w-4 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="skeleton h-12 w-full rounded-full"></div>
      </div>
    </div>
  );
};