import React from "react";
import { Badge } from "./ui-elements";
import { Eye, Plus } from "lucide-react";

export interface TeaProduct {
  id: string;
  name: string;
  category: "White" | "Black" | "Green" | "Oolong";
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
}

interface ProductCardProps {
  product: TeaProduct;
  onSelectProduct: (product: TeaProduct) => void;
  onAddToCart: (product: TeaProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
}) => {
  return (
    <div className="group flex flex-col bg-ivory-light border border-gold/15 transition-all duration-700 ease-out hover:shadow-xl hover:border-gold/30">
      {/* Product Image Wrapper */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Soft overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Hover quick-actions panel */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out translate-y-4 group-hover:translate-y-0">
          <button
            onClick={() => onSelectProduct(product)}
            className="p-3 bg-ivory text-forest hover:bg-forest hover:text-ivory rounded-none border border-gold/20 transition-all duration-300 shadow-md cursor-pointer"
            title="Inspect Tasting Notes"
          >
            <Eye className="w-4.5 h-4.5 stroke-[1.5]" />
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="p-3 bg-forest text-ivory hover:bg-gold hover:text-forest rounded-none border border-forest/10 transition-all duration-300 shadow-md cursor-pointer"
            title="Add to Cellar Reserve"
          >
            <Plus className="w-4.5 h-4.5 stroke-[1.5]" />
          </button>
        </div>

        {/* Elevation Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
          <Badge variant="gold">{product.tag}</Badge>
          <span className="text-[9px] font-sans font-bold bg-forest/80 text-ivory backdrop-blur-sm px-2 py-0.5 border border-ivory/10 tracking-widest uppercase">
            {product.elevation}
          </span>
        </div>
      </div>

      {/* Product Metadata Info */}
      <div className="p-5 flex flex-col flex-1 border-t border-gold/10">
        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-gold-dark mb-1">
          {product.category} ✦ {product.origin}
        </span>
        
        <h3 className="text-lg font-serif text-forest group-hover:text-gold transition-colors duration-300 font-medium">
          {product.name}
        </h3>
        
        <p className="text-[11px] text-forest/60 font-sans tracking-wide leading-relaxed mt-2 mb-4 line-clamp-2 font-light">
          {product.description}
        </p>

        <div className="mt-auto pt-3 border-t border-gold/5 flex items-center justify-between">
          <span className="text-sm font-sans tracking-widest font-semibold text-forest">
            ${product.price.toFixed(2)} <span className="text-[10px] text-forest/40 font-normal">/ 50g</span>
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="text-[9px] font-sans font-bold uppercase tracking-widest text-forest hover:text-gold transition-all duration-300 py-1.5 px-3 border border-transparent hover:border-gold/30 cursor-pointer"
          >
            Reserve Batch
          </button>
        </div>
      </div>
    </div>
  );
};
