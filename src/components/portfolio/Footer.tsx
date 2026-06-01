import React from "react";
import { Coffee, Shield, Sparkles, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest text-ivory border-t border-gold/15 pt-12 md:pt-20 pb-10 px-6 md:px-12 relative overflow-hidden">
      {/* Abstract map outline grid styling */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(197,168,128,0.02),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Certification Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 border-b border-ivory/10 pb-10 mb-12 text-center">
          {[
            { icon: <Coffee className="w-5 h-5 text-gold mx-auto mb-2" />, label: "Single-Estate Sourced", desc: "No blending or mixing" },
            { icon: <Shield className="w-5 h-5 text-gold mx-auto mb-2" />, label: "Certified Organic", desc: "Chemical free processes" },
            { icon: <Sparkles className="w-5 h-5 text-gold mx-auto mb-2" />, label: "Micro-Batch Lots", desc: "Strictly limited quantities" },
            { icon: <Heart className="w-5 h-5 text-gold mx-auto mb-2" />, label: "Ethical Harvest", desc: "Fair compensation systems" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {item.icon}
              <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ivory">
                {item.label}
              </h4>
              <p className="text-[9px] font-sans text-ivory/40 tracking-wider uppercase mt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Links & Brand grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Manifesto */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-serif tracking-[0.2em] text-ivory uppercase">
              ORIGIN HILLS
            </h3>
            <p className="text-xs text-ivory/60 font-sans tracking-wide leading-relaxed font-light">
              Crafted for collectors of taste. Rooted in the tea heritage of Assam and inspired by the timeless rituals of tea culture around the world.
            </p>
            <p className="text-[10px] text-gold font-sans tracking-widest uppercase font-semibold">
              Small-batch production • Authentic sourcing • Quiet luxury
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold">
              Navigation Manifesto
            </h4>
            <div className="flex flex-col gap-2 text-xs font-sans text-ivory/60">
              <a href="#manifesto" className="hover:text-gold transition-colors duration-300">The Brand Manifesto</a>
              <a href="#collections" className="hover:text-gold transition-colors duration-300">Curated Cellar Reserve</a>
              <a href="#terroirs" className="hover:text-gold transition-colors duration-300">Single-Origin Terroirs</a>
              <a href="#ritual" className="hover:text-gold transition-colors duration-300">Steeping Ritual Timer</a>
            </div>
          </div>

          {/* Private Registry Allocations */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold">
              Connoisseur Registry
            </h4>
            <div className="flex flex-col gap-2 text-xs font-sans text-ivory/60">
              <span className="hover:text-gold cursor-pointer transition-colors duration-300">Request Allocations</span>
              <span className="hover:text-gold cursor-pointer transition-colors duration-300">Terms of Allocation</span>
              <span className="hover:text-gold cursor-pointer transition-colors duration-300">Private Cellar Access</span>
              <span className="hover:text-gold cursor-pointer transition-colors duration-300">Cellar Lot Verification</span>
            </div>
          </div>

          {/* Contact Sourcing */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gold">
              Sourcing Headquarters
            </h4>
            <address className="not-italic text-xs font-sans text-ivory/60 leading-relaxed font-light">
              Origin Hills Tea House<br />
              Assam • India<br />
              Exports • UAE • Global<br />
              <span className="text-gold mt-2 block font-semibold">concierge@originhills.com</span>
            </address>
          </div>

        </div>

        {/* Legal bar */}
        <div className="border-t border-ivory/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-[9px] font-sans text-ivory/45 tracking-widest uppercase">
          <span>© 2026 ORIGIN HILLS PREMIUM LMT. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-6 mt-4 sm:mt-0 font-semibold">
            <span className="hover:text-gold cursor-pointer transition-colors">Privacy Charter</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Terms of Steeping</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Collector Allocations</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
