import React from "react";

export const Heritage: React.FC = () => {
  return (
    <section id="manifesto" className="py-24 md:py-32 px-6 md:px-12 bg-ivory relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(197,168,128,0.04),transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Heritage Section 1: Alternating Left Picture, Right Text */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20 mb-16 md:mb-24">
          
          {/* Photo Column */}
          <div className="w-full lg:w-1/2 relative">
            {/* Elegant double-line borders */}
            <div className="absolute -top-4 -left-4 w-full h-full border border-gold/15 pointer-events-none" />
            
            <div className="aspect-[4/5] bg-forest/5 overflow-hidden">
              <img
                src="/heritage_pluck.png"
                alt="Pristine tea gardens hand harvesting"
                className="w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-105"
                loading="lazy"
              />
            </div>
            
            <div className="absolute bottom-4 right-4 bg-forest text-ivory px-4 py-2 border border-gold/20 text-[9px] font-sans uppercase tracking-[0.2em] font-semibold">
              Elevation: 2,200m
            </div>
          </div>

          {/* Text Narrative Column */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold mb-3 block">
              OUR HERITAGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-forest font-light leading-tight mb-6">
              The Heritage of <br />
              <span className="italic font-normal text-gold text-serif">Origin Hills</span>
            </h2>
            <div className="w-12 h-px bg-gold/50 my-2" />
            
            <div className="flex flex-col gap-4 text-xs font-sans text-forest/75 font-light leading-relaxed tracking-wide">
              <p>
                Born in Assam—the heartland of the world's finest orthodox tea—Origin Hills was created to preserve the disappearing art of slow tea craftsmanship.
              </p>
              <p>
                In an age dominated by industrial production and convenience, we remain committed to small-batch excellence and traditional methods that allow tea to express its natural character.
              </p>
              <p>
                We collaborate with select gardens and artisans who value quality over volume, producing teas that reflect the identity of their terroir, season, and harvest. Each cup tells a story of heritage, patience, and unwavering attention to detail.
              </p>
              <p className="italic font-semibold text-gold-dark mt-2 border-l-2 border-gold/30 pl-4 py-1 bg-gold/5">
                “Luxury is not excess. Luxury is uncompromising attention to detail.”
              </p>
            </div>
          </div>

        </div>

        {/* Heritage Section 2: Alternating Right Picture, Left Text */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-20">
          
          {/* Photo Column */}
          <div className="w-full lg:w-1/2 relative">
            {/* Elegant double-line borders */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-gold/15 pointer-events-none" />
            
            <div className="aspect-[4/5] bg-forest/5 overflow-hidden">
              <img
                src="/heritage_dry.png"
                alt="Smoky Himalayan Blend drying and preparation"
                className="w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-105"
                loading="lazy"
              />
            </div>
            
            <div className="absolute bottom-4 left-4 bg-forest text-ivory px-4 py-2 border border-gold/20 text-[9px] font-sans uppercase tracking-[0.2em] font-semibold">
              Drying Process
            </div>
          </div>

          {/* Text Narrative Column */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold mb-3 block">
              CRAFTSMANSHIP
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-forest font-light leading-tight mb-6">
              The Craft Behind <br />
              <span className="italic font-normal text-gold text-serif">Every Leaf</span>
            </h2>
            <div className="w-12 h-px bg-gold/50 my-2" />
            
            <div className="flex flex-col gap-4 text-xs font-sans text-forest/75 font-light leading-relaxed tracking-wide">
              <p>
                Exceptional tea begins long before it reaches the cup. Each harvest undergoes careful withering, rolling, oxidation, and drying under controlled conditions that preserve aroma, complexity, and natural character.
              </p>
              <p>
                Our artisans evaluate every stage by hand, allowing the leaf to develop naturally without artificial enhancement or accelerated processing.
              </p>
              <p className="font-semibold text-gold-dark">
                No shortcuts. No artificial flavoring. No compromise. Only patience, precision, and time.
              </p>
              <p>
                Every Origin Hills tea is crafted to capture the essence of its harvest season and place of origin.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
