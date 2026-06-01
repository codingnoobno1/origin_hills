"use client";
import React, { useState } from "react";
import { TeaProduct, ProductCard } from "./ProductCard";

interface CollectionGridProps {
  products: TeaProduct[];
  loading?: boolean;
  onSelectProduct: (product: TeaProduct) => void;
  onAddToCart: (product: TeaProduct) => void;
}

const COLLECTIONS = [
  {
    id: "all",
    label: "All",
    tagline: "The complete reserve",
    description: null,
  },
  {
    id: "Estate Collection",
    label: "Estate Collection",
    tagline: "The pure expression of origin",
    description: "Single-estate teas sourced from named gardens, expressing the unique character of soil, altitude, and season without alteration.",
    features: ["Single Estate Loose Orthodox", "Silver Needles", "First Flush Selections"],
  },
  {
    id: "Signature Blends",
    label: "Signature Blends",
    tagline: "Artisanal blends, exceptional taste",
    description: "Carefully composed blends where individual teas are selected for their contribution to a unified sensory experience.",
    features: ["Rose Noir", "Smoky Himalayan", "Citrus Dawn", "Seasonal Signature Releases"],
  },
  {
    id: "Wellness Reserve",
    label: "Wellness Reserve",
    tagline: "Functional teas for daily rituals",
    description: "Thoughtfully formulated teas that serve both the palate and wellbeing, crafted with functional botanicals and premium tea bases.",
    features: ["Digestive Blends", "Immunity Blends", "Calm & Sleep", "Daily Wellness Formulations"],
  },
  {
    id: "Floral Reserve",
    label: "Floral Reserve",
    tagline: "Elegant botanical compositions",
    description: "Delicate compositions featuring hand-selected florals layered with fine tea, offering aromatic elegance and visual beauty.",
    features: ["Rose-Based Blends", "Floral Botanical Blends", "Seasonal Floral Releases"],
  },
  {
    id: "Grand Reserve",
    label: "Grand Reserve",
    tagline: "The pinnacle of craftsmanship",
    description: "Reserved for extraordinary teas — rare harvests, limited lots, and seasonal selections available in the strictest allocations.",
    features: ["Silver Needles", "Rare Estate Lots", "Limited Harvest Releases", "Premium Seasonal Selections"],
  },
];

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  products,
  loading = false,
  onSelectProduct,
  onAddToCart,
}) => {
  const [activeId, setActiveId] = useState("all");

  const active = COLLECTIONS.find((c) => c.id === activeId)!;
  const filtered = activeId === "all" ? products : products.filter((p) => p.category === activeId);

  return (
    <section id="collections" className="bg-[#f7f4ee] py-20 md:py-32">

      {/* ── Section Header ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          {/* Label */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-gold/40" />
            <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-gold">
              Curated Collections
            </span>
            <div className="h-px w-12 bg-gold/40" />
          </div>

          {/* Heading */}
          <h2 className="font-serif text-forest text-3xl sm:text-5xl md:text-6xl font-light leading-[1.08] tracking-tight mb-6 max-w-2xl">
            The Origin Hills Reserve
          </h2>

          {/* Description */}
          <p className="text-sm text-forest/55 font-sans leading-relaxed max-w-lg font-light tracking-wide">
            A distinguished collection of single-estate teas and artisanal blends crafted in limited quantities. Each release reflects exceptional terroir, craftsmanship, and sensory excellence.
          </p>
        </div>

        {/* ── Collection Filter Tabs ── */}
        <div className="mb-0">
          {/* Scrollable tab row */}
          <div className="flex overflow-x-auto gap-0 border-b border-gold/15 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 md:justify-center">
            {COLLECTIONS.map((col) => {
              const isActive = activeId === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setActiveId(col.id)}
                  className={`flex-shrink-0 flex flex-col items-start md:items-center px-4 md:px-6 pb-4 pt-1 border-b-2 transition-all duration-300 cursor-pointer text-left md:text-center group ${
                    isActive
                      ? "border-gold text-forest"
                      : "border-transparent text-forest/40 hover:text-forest/70"
                  }`}
                >
                  <span className={`text-[11px] font-sans font-bold uppercase tracking-[0.18em] whitespace-nowrap transition-colors duration-300 ${isActive ? "text-forest" : ""}`}>
                    {col.label}
                  </span>
                  <span className={`text-[9px] font-sans italic tracking-wide whitespace-nowrap mt-0.5 hidden md:block transition-colors duration-300 ${isActive ? "text-gold" : "text-forest/30 group-hover:text-forest/45"}`}>
                    {col.tagline}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active collection description */}
          {active.description && (
            <div className="mt-10 mb-4 flex flex-col md:flex-row md:items-start gap-6 md:gap-12 px-0 animate-fade-in">
              <div className="flex-1">
                <p className="text-xs font-sans text-forest/55 leading-relaxed font-light tracking-wide max-w-xl">
                  {active.description}
                </p>
              </div>
              {active.features && (
                <div className="flex flex-wrap gap-2 md:justify-end md:max-w-xs">
                  {active.features.map((f) => (
                    <span key={f} className="text-[9px] font-sans uppercase tracking-widest text-forest/50 border border-gold/20 px-3 py-1.5 bg-ivory/60">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-16">
        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="aspect-[3/4] bg-forest/8 w-full" />
                <div className="flex flex-col gap-2 px-1">
                  <div className="h-2 bg-forest/10 rounded w-1/3" />
                  <div className="h-4 bg-forest/10 rounded w-4/5" />
                  <div className="h-2 bg-forest/8 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty */
          <div className="py-24 flex flex-col items-center gap-4 text-center">
            <div className="w-px h-12 bg-gold/30 mx-auto" />
            <p className="text-forest/35 font-sans text-[11px] uppercase tracking-[0.25em]">
              No teas in this collection yet
            </p>
            <p className="text-forest/25 font-sans text-xs">Products added from the admin console will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 md:gap-x-8 gap-y-12 md:gap-y-16">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-20 flex items-center gap-6 justify-center">
          <div className="h-px flex-1 max-w-[100px] bg-gold/15" />
          <span className="text-[8px] font-sans text-forest/30 uppercase tracking-[0.28em]">
            Strictly limited · {filtered.length} {activeId === "all" ? "teas" : "in this collection"}
          </span>
          <div className="h-px flex-1 max-w-[100px] bg-gold/15" />
        </div>
      </div>
    </section>
  );
};
