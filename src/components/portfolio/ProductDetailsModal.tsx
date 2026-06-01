import React from "react";
import { X, Flame, GlassWater, Timer, ShoppingBag } from "lucide-react";
import { TeaProduct } from "./ProductCard";
import { Button, Badge } from "./ui-elements";

interface ProductDetailsModalProps {
  product: TeaProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: TeaProduct) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-forest/85 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-ivory text-forest border border-gold/30 rounded-none shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-forest/40 hover:text-forest bg-ivory/50 backdrop-blur-md p-1.5 transition-colors duration-300 cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Left Side: Product Portrait */}
        <div className="md:w-1/2 relative bg-forest/10 min-h-[300px] md:min-h-auto">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/45 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-6 left-6 text-ivory">
            <span className="text-[10px] uppercase font-bold text-gold tracking-widest block mb-1">
              Estate Altitude
            </span>
            <p className="text-xl font-serif tracking-wide">{product.elevation}</p>
          </div>
        </div>

        {/* Right Side: Product Details & Profiles */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between bg-ivory">
          <div>
            {/* Hierarchy Category */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold">{product.category}</Badge>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-forest/40">
                ✦ {product.origin}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-serif text-forest tracking-wide leading-tight">
              {product.name}
            </h2>
            <div className="w-12 h-px bg-gold/40 my-4" />

            {/* Description */}
            <p className="text-xs text-forest/75 font-sans leading-relaxed tracking-wide mb-6 font-light">
              {product.description}
            </p>

            {/* Tasting Notes Bullets */}
            <div className="mb-6">
              <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-forest/50 mb-2.5">
                Signature Tasting Profile
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2.5 py-1 text-[10px] font-sans font-medium bg-gold/5 border border-gold/15 text-gold-dark uppercase tracking-widest"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Character Sliders */}
            <div className="mb-6 border-t border-gold/10 pt-4 flex flex-col gap-3">
              <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-forest/50">
                Flavor Dimensions
              </h4>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {[
                  { label: "Aromatic Infusion", value: product.profiles.aromatic },
                  { label: "Mineral Terroir", value: product.profiles.mineral },
                  { label: "Floral Bouquet", value: product.profiles.floral },
                  { label: "Roasted Accent", value: product.profiles.roasted },
                  { label: "Savory Umami", value: product.profiles.umami },
                ].map((profile) => (
                  <div key={profile.label} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] font-sans uppercase text-forest/60 tracking-wider">
                      <span>{profile.label}</span>
                      <span className="font-bold text-forest">{profile.value}/10</span>
                    </div>
                    <div className="h-1 bg-forest/5 relative">
                      <div
                        className="h-full bg-gold transition-all duration-1000 ease-out"
                        style={{ width: `${profile.value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brewing Metrics */}
            <div className="border-t border-gold/10 pt-4 mb-6">
              <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-forest/50 mb-3">
                Steeping Ritual Metrics
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 text-center">
                <div className="bg-forest/5 p-3 flex flex-col items-center gap-1 border border-forest/5">
                  <Flame className="w-4 h-4 text-gold" />
                  <span className="text-[9px] font-sans uppercase tracking-widest text-forest/55">Temp</span>
                  <span className="text-xs font-sans font-bold text-forest">{product.steepTemp}</span>
                </div>
                <div className="bg-forest/5 p-3 flex flex-col items-center gap-1 border border-forest/5">
                  <GlassWater className="w-4 h-4 text-gold" />
                  <span className="text-[9px] font-sans uppercase tracking-widest text-forest/55">Water</span>
                  <span className="text-xs font-sans font-bold text-forest">200 ml</span>
                </div>
                <div className="bg-forest/5 p-3 flex flex-col items-center gap-1 border border-forest/5">
                  <Timer className="w-4 h-4 text-gold" />
                  <span className="text-[9px] font-sans uppercase tracking-widest text-forest/55">Duration</span>
                  <span className="text-xs font-sans font-bold text-forest">{product.steepTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Price & Add to Cart */}
          <div className="border-t border-gold/15 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-forest/50">
                Cellar Price
              </span>
              <span className="text-lg font-sans font-bold tracking-widest text-forest">
                ${product.price.toFixed(2)}{" "}
                <span className="text-[11px] font-normal text-forest/40">/ 50g tin</span>
              </span>
            </div>
            <Button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              variant="primary"
              size="md"
              className="flex items-center gap-2 shadow-sm font-semibold w-full sm:w-auto"
            >
              <ShoppingBag className="w-4 h-4 text-ivory" />
              Add to Reserve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
