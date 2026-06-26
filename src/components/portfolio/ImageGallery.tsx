import React from "react";

export const ImageGallery: React.FC = () => {
  return (
    <section className="py-32 bg-ivory text-forest font-serif overflow-hidden border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        
        {/* Header Section */}
        <div className="text-center mb-24 md:mb-32">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold mb-6 block">
            VISUAL Manifest
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide mb-8">
            Sensory Textures
          </h2>
          <div className="w-16 h-[1px] bg-gold/50 mx-auto" />
        </div>

        <div className="space-y-32 md:space-y-48">
          {/* Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-5 space-y-8 order-2 lg:order-1 lg:pr-12">
              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-light">Texture</h3>
                <span className="text-sm font-sans uppercase tracking-[0.2em] text-gold block">
                  The architecture of the leaf.
                </span>
              </div>
              <p className="text-forest/75 leading-relaxed font-sans text-sm sm:text-base font-light">
                Hand-twisted orthodox leaves, golden tips, and artisanal processing reveal the craftsmanship behind every harvest.
              </p>
            </div>
            <div className="lg:col-span-7 relative h-[60vh] min-h-[450px] w-full group overflow-hidden order-1 lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=2070&auto=format&fit=crop" 
                alt="Texture of the leaf" 
                className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <div className="lg:col-span-7 relative h-[70vh] min-h-[550px] w-full group overflow-hidden shadow-2xl shadow-forest/5">
              <img 
                src="https://images.unsplash.com/photo-1594631252845-29fc4586d52c?q=80&w=1974&auto=format&fit=crop" 
                alt="Steeping in a Gaiwan Vessel" 
                className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-light">The Ritual</h3>
                <span className="text-sm font-sans uppercase tracking-[0.2em] text-gold block">
                  Steeping in a Gaiwan Vessel.
                </span>
              </div>
              <p className="text-forest/75 leading-relaxed font-sans text-sm sm:text-base font-light">
                Observe the leaves awaken through successive infusions as aroma, color, and character gradually unfold.
              </p>
              
              <div className="grid grid-cols-3 gap-6 py-10 border-y border-gold/30 font-sans">
                <div className="text-center sm:text-left">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-gold mb-3">Temp</span>
                  <span className="text-sm tracking-widest text-forest">90–95°C</span>
                </div>
                <div className="text-center sm:text-left border-l border-gold/20 pl-6">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-gold mb-3">Dose</span>
                  <span className="text-sm tracking-widest text-forest">5g Leaf</span>
                </div>
                <div className="text-center sm:text-left border-l border-gold/20 pl-6">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-gold mb-3">Time</span>
                  <span className="text-sm tracking-widest text-forest">20–45 sec</span>
                </div>
              </div>

              <a href="#ritual" className="inline-flex items-center group/btn text-[11px] font-sans tracking-[0.25em] uppercase text-forest hover:text-gold transition-colors duration-500">
                DISCOVER THE RITUAL
                <svg className="w-4 h-4 ml-4 transform group-hover/btn:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Block 3 & 4: Staggered Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start pt-8">
            
            {/* Block 3 */}
            <div className="lg:col-span-5 space-y-12">
              <div className="relative h-[55vh] min-h-[450px] w-full group overflow-hidden mb-16 shadow-xl shadow-forest/5">
                <img 
                  src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974&auto=format&fit=crop" 
                  alt="Estate Expression" 
                  className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="space-y-8 pr-4">
                <div className="space-y-4">
                  <h3 className="text-3xl sm:text-4xl font-light">Estate Expression</h3>
                  <span className="text-sm font-sans uppercase tracking-[0.2em] text-gold block">
                    The voice of the terroir.
                  </span>
                </div>
                <p className="text-forest/75 leading-relaxed font-sans text-sm sm:text-base font-light">
                  Cultivated in Assam&apos;s fertile tea-growing regions, each harvest reflects seasonal rainfall, elevation, soil composition, and generations of expertise.
                </p>
                <ul className="space-y-5 pt-8 font-sans text-sm font-light text-forest/80 border-t border-gold/20">
                  <li className="flex justify-between items-center pb-5 border-b border-forest/10">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-gold font-medium">Origin</span>
                    <span className="tracking-wide">Assam, India</span>
                  </li>
                  <li className="flex justify-between items-center pb-5 border-b border-forest/10">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-gold font-medium">Harvest</span>
                    <span className="tracking-wide">Seasonal Selection</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-gold font-medium">Style</span>
                    <span className="tracking-wide">Single Estate Orthodox</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Block 4 */}
            <div className="lg:col-span-6 lg:col-start-7 lg:mt-40">
              <div className="bg-forest text-ivory p-12 sm:p-20 relative group overflow-hidden shadow-2xl">
                {/* Default State */}
                <div className="relative z-10 transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:translate-y-4">
                  <div className="space-y-4 mb-16">
                    <h3 className="text-3xl sm:text-4xl font-light">Sensory Profile</h3>
                    <div className="w-12 h-[1px] bg-gold/50" />
                  </div>
                  
                  <div className="space-y-10 font-sans text-sm font-light">
                    <div>
                      <span className="block text-gold text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">Aroma</span>
                      <p className="tracking-widest text-base">Malt • Honey • Stone Fruit</p>
                    </div>
                    <div>
                      <span className="block text-gold text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">Body</span>
                      <p className="tracking-widest text-base">Rich & Velvety</p>
                    </div>
                    <div>
                      <span className="block text-gold text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">Finish</span>
                      <p className="tracking-widest text-base">Long & Lingering</p>
                    </div>
                    <div>
                      <span className="block text-gold text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">Character</span>
                      <p className="tracking-widest text-base">Elegant Complexity</p>
                    </div>
                  </div>
                </div>

                {/* Hover Reveal State */}
                <div className="absolute inset-0 bg-gold flex items-center justify-center p-12 sm:p-20 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out z-20">
                  <p className="text-2xl sm:text-3xl font-serif font-light text-center leading-relaxed text-forest">
                    &quot;Every infusion unveils a new dimension of the leaf&apos;s journey from estate to cup.&quot;
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

