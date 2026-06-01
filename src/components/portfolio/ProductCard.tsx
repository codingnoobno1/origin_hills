import React, { useState } from "react";

export interface TeaProduct {
  id: string;
  name: string;
  category: string;
  tag: string;
  origin: string;
  elevation: string;
  price: number;
  description: string;
  image: string;
  steepTemp: string;
  steepTime: string;
  tastingNotes: string[];
  profiles: { aromatic: number; mineral: number; floral: number; roasted: number; umami: number };
  stock?: number;
  active?: boolean;
}

interface ProductCardProps {
  product: TeaProduct;
  onSelectProduct: (product: TeaProduct) => void;
  onAddToCart: (product: TeaProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct, onAddToCart }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="group flex flex-col bg-ivory cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelectProduct(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#eae6df]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.04]"
        />

        {/* Gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f16]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Tag badge */}
        {product.tag && (
          <div className="absolute top-4 left-4">
            <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.18em] text-ivory bg-[#0d1f16]/70 backdrop-blur-sm px-2.5 py-1 border border-ivory/15">
              {product.tag}
            </span>
          </div>
        )}

        {/* Hover reveal — Discover */}
        <div className={`absolute inset-x-0 bottom-0 flex items-center justify-center pb-6 transition-all duration-500 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onSelectProduct(product); }}
            className="text-[10px] font-sans font-semibold uppercase tracking-[0.22em] text-ivory border border-ivory/50 px-5 py-2.5 hover:bg-ivory hover:text-forest transition-all duration-300 cursor-pointer min-h-[40px] backdrop-blur-sm"
          >
            Discover
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="pt-5 pb-6 px-1 flex flex-col gap-2">
        {/* Collection label + gold rule */}
        <div className="flex items-center gap-2.5">
          <span className="text-[8px] font-sans font-bold uppercase tracking-[0.22em] text-gold">{product.category}</span>
          <div className="flex-1 h-px bg-gold/20" />
        </div>

        {/* Name */}
        <h3 className="font-serif text-forest text-[1.05rem] leading-snug font-light group-hover:text-gold transition-colors duration-500">
          {product.name}
        </h3>

        {/* Origin */}
        {product.origin && (
          <p className="text-[10px] font-sans text-forest/45 tracking-wide italic">{product.origin}</p>
        )}

        {/* Price + Reserve */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gold/10">
          <div className="flex flex-col">
            <span className="text-[9px] font-sans uppercase tracking-widest text-forest/40">From</span>
            <span className="font-sans font-semibold text-forest text-sm tracking-wider">
              ${product.price.toFixed(2)}
              <span className="text-[9px] font-normal text-forest/35 ml-1">/ 50g</span>
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="text-[9px] font-sans font-bold uppercase tracking-[0.18em] text-forest/60 hover:text-gold transition-colors duration-300 py-2 px-3 border border-transparent hover:border-gold/25 cursor-pointer min-h-[36px]"
          >
            Reserve
          </button>
        </div>
      </div>
    </article>
  );
};
