import React from "react";

export const BrandPhilosophy: React.FC = () => {
  return (
    <section className="relative py-28 md:py-36 bg-forest text-ivory overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.06),transparent_60%)]" />
      
      {/* Fine-line double frames */}
      <div className="absolute inset-x-8 inset-y-8 border border-gold/10 pointer-events-none" />
      <div className="absolute inset-x-12 inset-y-12 border border-gold/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-gold mb-6 block">
          THE MANIFESTO OF CALM
        </span>
        
        <p className="text-xl sm:text-3xl md:text-5xl font-serif font-light leading-relaxed italic text-ivory-light mb-8 select-none">
          “Time is the ultimate luxury. <br />
          Steeping is the silent art of mastering it.”
        </p>

        <div className="w-12 h-[1px] bg-gold/40 mx-auto my-6" />

        <p className="text-xs text-ivory/50 font-sans tracking-wide leading-relaxed max-w-lg mx-auto font-light">
          At Origin Hills, we pluck only the silver tips and pristine double-leaves during the fleeting golden hours of dawn. What we bottle is not just organic leaves, but the slow, patient breath of high elevation terroirs.
        </p>
      </div>
    </section>
  );
};
