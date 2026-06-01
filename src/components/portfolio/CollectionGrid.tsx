import React, { useState } from "react";
import { TeaProduct, ProductCard } from "./ProductCard";

interface CollectionGridProps {
  products: TeaProduct[];
  onSelectProduct: (product: TeaProduct) => void;
  onAddToCart: (product: TeaProduct) => void;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "White", "Black", "Green", "Oolong"];

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section id="collections" className="py-24 md:py-32 px-6 md:px-12 bg-ivory relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Block */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold mb-3 block">
            CURATED ALLOCATIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-forest font-light leading-tight">
            The Estate Cellar Reserve
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto my-6" />
          <p className="text-xs sm:text-sm text-forest/60 font-sans tracking-wide leading-relaxed max-w-lg mx-auto font-light">
            Each batch represents a singular vintage crop, individually vacuum-sealed in oxygen-depleted glass vials at the moment of drying to preserve pure volatile aromatic compounds.
          </p>
        </div>

        {/* Categories Tab selector */}
        <div className="flex justify-center items-center gap-3 sm:gap-6 mb-12 flex-wrap border-b border-gold/10 pb-6 max-w-2xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] font-sans font-semibold uppercase tracking-[0.2em] transition-all duration-300 py-2 px-3 sm:px-4 cursor-pointer relative ${
                activeCategory === cat
                  ? "text-gold font-bold"
                  : "text-forest/60 hover:text-forest"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute bottom-[-1.5px] left-0 right-0 h-[1.5px] bg-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Sourcing Footnote */}
        <div className="text-center mt-16 text-[9px] font-sans text-forest/40 tracking-widest uppercase">
          ✦ STRICT LIMIT OF 3 TINS PER ALLOCATED CONNOISSEUR COLLECTOR BATCH ✦
        </div>
      </div>
    </section>
  );
};
