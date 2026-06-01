import React, { useState } from "react";
import { Sparkles, Brain, Sprout, Heart, Coffee, RefreshCw } from "lucide-react";
import { TeaProduct } from "./ProductCard";
import { Button } from "./ui-elements";

interface InteractiveFlavorWheelProps {
  products: TeaProduct[];
  onSelectProduct: (product: TeaProduct) => void;
  onAddToCart: (product: TeaProduct) => void;
}

export const InteractiveFlavorWheel: React.FC<InteractiveFlavorWheelProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTaste, setSelectedTaste] = useState<string | null>(null);

  const moods = [
    { id: "meditative", label: "Meditative", desc: "For slow deep reflection", icon: <Brain className="w-4 h-4 text-gold" /> },
    { id: "revitalizing", label: "Revitalizing", desc: "Clean focus & clarity", icon: <RefreshCw className="w-4 h-4 text-gold" /> },
    { id: "sensory", label: "Rich Sensory", desc: "Intense aroma & taste profile", icon: <Sparkles className="w-4 h-4 text-gold" /> },
    { id: "comfort", label: "Serene Comfort", desc: "Warm soothing balance", icon: <Heart className="w-4 h-4 text-gold" /> },
  ];

  const tastes = [
    { id: "floral", label: "Delicate Floral", category: "White" },
    { id: "savory", label: "Sea-Spray Umami", category: "Green" },
    { id: "honey", label: "Honey Muscatel", category: "Black" },
    { id: "mineral", label: "Roasted Mineral", category: "Oolong" },
  ];

  // Pick recommendation based on answers
  const getRecommendation = (): TeaProduct | null => {
    if (!selectedMood && !selectedTaste) return null;

    // Use selections to match category
    let targetCategory: "White" | "Green" | "Black" | "Oolong" = "White";
    if (selectedTaste) {
      const match = tastes.find((t) => t.id === selectedTaste);
      if (match) targetCategory = match.category as any;
    } else if (selectedMood) {
      if (selectedMood === "meditative") targetCategory = "White";
      else if (selectedMood === "revitalizing") targetCategory = "Green";
      else if (selectedMood === "sensory") targetCategory = "Oolong";
      else targetCategory = "Black";
    }

    return products.find((p) => p.category === targetCategory) || products[0];
  };

  const recommendedTea = getRecommendation();

  const handleReset = () => {
    setSelectedMood(null);
    setSelectedTaste(null);
  };

  return (
    <section className="py-20 md:py-24 bg-forest text-ivory relative overflow-hidden border-t border-gold/15">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold mb-3 block">
            PERSONALIZED MATCHING
          </span>
          <h3 className="text-2xl sm:text-4xl font-serif text-ivory font-light">
            Decipher Your Ideal Steeping
          </h3>
          <div className="w-10 h-px bg-gold/50 mx-auto my-4" />
          <p className="text-xs text-ivory/60 font-sans tracking-wide max-w-md mx-auto font-light">
            Match your present emotional state and sensory focus to our micro-crop inventory for a custom allocation recommendation.
          </p>
        </div>

        {/* Wizard Panel */}
        <div className="max-w-4xl mx-auto bg-forest-dark border border-gold/15 p-5 sm:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
          
          {/* Controls Column */}
          <div className="md:w-7/12 flex flex-col gap-6">
            
            {/* Step 1: Mood */}
            <div>
              <span className="text-[9px] font-sans font-bold text-gold uppercase tracking-[0.2em] mb-3.5 block">
                Step 1: Define Your Desired state
              </span>
              <div className="grid grid-cols-2 gap-3">
                {moods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className={`p-3 border text-left flex flex-col gap-1 cursor-pointer transition-all duration-500 ${
                      selectedMood === m.id
                        ? "bg-gold text-forest border-gold"
                        : "bg-forest border-ivory/10 text-ivory/80 hover:border-gold/30 hover:bg-forest/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {m.icon}
                      <span className="text-xs font-sans font-semibold uppercase tracking-wider">{m.label}</span>
                    </div>
                    <span className={`text-[9px] font-sans font-light ${selectedMood === m.id ? "text-forest/70" : "text-ivory/40"}`}>
                      {m.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Taste */}
            <div className={`transition-opacity duration-500 ${selectedMood ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
              <span className="text-[9px] font-sans font-bold text-gold uppercase tracking-[0.2em] mb-3.5 block">
                Step 2: Define Your Flavor Focus
              </span>
              <div className="grid grid-cols-2 gap-3">
                {tastes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTaste(t.id)}
                    className={`p-3 border text-left cursor-pointer transition-all duration-500 flex items-center justify-between ${
                      selectedTaste === t.id
                        ? "bg-gold text-forest border-gold font-bold"
                        : "bg-forest border-ivory/10 text-ivory hover:border-gold/30"
                    }`}
                  >
                    <span className="text-[10px] font-sans uppercase tracking-wider font-semibold">{t.label}</span>
                    <Sprout className="w-3.5 h-3.5 opacity-40" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Column */}
          <div className="md:w-5/12 bg-ivory text-forest p-6 sm:p-8 flex flex-col justify-between border border-gold/20 relative">
            {recommendedTea ? (
              <div className="flex flex-col justify-between h-full animate-fade-in">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-sans font-bold text-gold uppercase tracking-widest">
                      Your Scent-Match Recommendation
                    </span>
                    <button
                      onClick={handleReset}
                      className="text-[9px] font-sans font-bold text-forest/40 hover:text-gold uppercase tracking-wider cursor-pointer"
                    >
                      Reset Quiz
                    </button>
                  </div>

                  {/* Recommendation preview */}
                  <div className="w-full h-28 sm:h-36 bg-forest/10 overflow-hidden border border-gold/10 relative mb-4">
                    <img
                      src={recommendedTea.image}
                      alt={recommendedTea.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span className="text-[9px] font-sans font-bold text-gold-dark uppercase tracking-wider block mb-0.5">
                    {recommendedTea.category} ✦ {recommendedTea.origin}
                  </span>
                  
                  <h4 className="text-lg font-serif text-forest tracking-wide leading-snug">
                    {recommendedTea.name}
                  </h4>
                  
                  <p className="text-[11px] text-forest/65 font-sans leading-relaxed tracking-wide font-light line-clamp-3 mt-2">
                    {recommendedTea.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gold/10 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-sans tracking-wide mb-2">
                    <span className="text-forest/60">Registry Allocation Price</span>
                    <span className="font-bold text-forest">${recommendedTea.price.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onSelectProduct(recommendedTea)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Inspect Tasting
                    </Button>
                    <Button
                      onClick={() => onAddToCart(recommendedTea)}
                      variant="primary"
                      size="sm"
                      className="flex-1 font-semibold"
                    >
                      Reserve tin
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <Coffee className="w-8 h-8 text-gold/40 mb-3" />
                <h4 className="text-sm font-serif text-forest tracking-wide">Awaiting Selections</h4>
                <p className="text-[10px] text-forest/50 font-sans leading-normal max-w-[180px] mt-2">
                  Define your mood and favorite notes in the panel to trace your ideal estate allocation.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
