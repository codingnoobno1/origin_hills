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
              Quiet Luxury, <br />
              <span className="italic font-normal text-gold text-serif">harvested by hand.</span>
            </h2>
            <div className="w-12 h-px bg-gold/50 my-2" />
            
            <div className="flex flex-col gap-4 text-xs font-sans text-forest/75 font-light leading-relaxed tracking-wide">
              <p>
                In an era dominated by high-speed processing and artificial flavor enhancers, Origin Hills was founded to preserve the meditative, quiet sanctuary of slow steeping. We reject industrialized agriculture completely.
              </p>
              <p>
                Our farmers operate in small, biodynamic cooperatives across Darjeeling, Uji, and East Nepal. They ascend steep mountain terrain under the cover of early morning dew to hand-pluck only the iconic <em>“two leaves and a bud”</em>—the absolute ceiling of quality and essential oil concentration.
              </p>
              <p className="italic font-semibold text-gold-dark mt-2">
                “This is the Loro Piana of tea—an uncompromised dedication to raw botanical fibers and immaculate natural origins.”
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
              THE MATURITY Manifest
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-forest font-light leading-tight mb-6">
              Oxidation & <br />
              <span className="italic font-normal text-gold text-serif">slow drying art.</span>
            </h2>
            <div className="w-12 h-px bg-gold/50 my-2" />
            
            <div className="flex flex-col gap-4 text-xs font-sans text-forest/75 font-light leading-relaxed tracking-wide">
              <p>
                Once harvested, the fragile leaves are transported immediately in padded bamboo baskets to our drying huts. Here, they undergo withering over slow wood fire coal heat.
              </p>
              <p>
                Our tea master, with a lineage spanning seven generations, conducts touch inspections to monitor the rate of leaf moisture loss and soft enzymatic oxidation. We allow our teas to mature naturally without chemical accelerants, bringing out an unmatched complex palette.
              </p>
              <p>
                Every single package of Origin Hills carries a certified lot identification code, allowing collectors to verify the exact slope location, harvest hour, and tasting batch characteristics of their tea.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
