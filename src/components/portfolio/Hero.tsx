import React from "react";
import { ArrowDown, FlameKindling } from "lucide-react";
import { Button } from "./ui-elements";

interface HeroProps {
  onExploreClick: () => void;
  onRegistryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onRegistryClick }) => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[95vh] flex items-center justify-center bg-forest text-ivory overflow-hidden pt-20">
      {/* Background Image with parallax overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.55] transition-transform duration-[4000ms] scale-105"
        style={{
          backgroundImage: "url('/tea_garden_header.png')",
        }}
      />

      {/* Elegant Radial Gradients representing quiet luxury atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,168,128,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(13,31,22,0.95),rgba(13,31,22,0.2))]" />
      
      {/* Visual top and bottom fine gold borders */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gold/15" />
      <div className="absolute bottom-12 left-12 right-12 h-px bg-gold/15" />

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center min-h-[70vh]">
        
        {/* Brand logo — mobile only, above estate badge */}
        <a
          href="#"
          className="md:hidden text-2xl font-serif tracking-[0.3em] text-ivory select-none whitespace-nowrap mb-5 animate-[fade-in_1s_ease-out]"
        >
          ORIGIN HILLS
        </a>

        {/* Fine gold ornament badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/30 bg-forest/40 backdrop-blur-md rounded-none mb-6 animate-[fade-in_1s_ease-out]">
          <FlameKindling className="w-3 h-3 text-gold" />
          <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.25em] text-gold">
            ESTATE RESERVE SELECTION
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-ivory font-light leading-[1.1] mb-8 max-w-4xl tracking-tight">
          Where soil, mist, <br className="hidden sm:inline" />
          and time steer <span className="italic font-normal text-gold text-serif gold-glow">perfection.</span>
        </h1>

        {/* Brand narrative baseline */}
        <p className="text-xs sm:text-sm text-ivory/70 font-sans tracking-wide leading-relaxed max-w-lg mb-10 font-light">
          An exquisite registry of limited micro-batch tea allocations, hand-plucked in high-altitude clouds and crafted for collectors of the ultimate steeping luxury.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <Button
            onClick={onExploreClick}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto shadow-md"
          >
            Explore Reserve
          </Button>
          <Button
            onClick={onRegistryClick}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-ivory/30 text-ivory hover:bg-ivory/5 hover:border-ivory"
          >
            Request Allocation
          </Button>
        </div>
      </div>

      {/* Floating coordinates indicator (Loro Piana visual cue) */}
      <div className="absolute bottom-6 left-12 hidden lg:flex items-center gap-3 text-[9px] font-sans text-ivory/45 tracking-[0.2em] uppercase font-semibold">
        <span>EST. 2026</span>
        <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
        <span>KANCHENJUNGA 27.7025° N, 88.1475° E</span>
      </div>

      {/* Fine scroll indicator */}
      <div className="absolute bottom-6 right-12 hidden lg:flex items-center gap-2.5 text-[9px] font-sans text-ivory/45 tracking-[0.2em] uppercase font-semibold">
        <span>Scroll Down</span>
        <ArrowDown className="w-3.5 h-3.5 text-gold animate-[bounce_2s_infinite]" />
      </div>
    </section>
  );
};
