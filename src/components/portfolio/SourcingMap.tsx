import React, { useState } from "react";
import { MapPin, Globe, Compass, ArrowRight } from "lucide-react";
import { Badge } from "./ui-elements";

interface SourcingRegion {
  id: string;
  name: string;
  country: string;
  elevation: string;
  terroir: string;
  crop: string;
  coordinates: string;
  description: string;
}

const REGIONS: SourcingRegion[] = [
  {
    id: "darjeeling",
    name: "Makaibari Hills",
    country: "Darjeeling, India",
    elevation: "1,500m - 1,800m",
    terroir: "Subtropical misty forest loam, high acidic minerals",
    crop: "First Flush Black Pearl Tea",
    coordinates: "26.8529° N, 88.2636° E",
    description: "Nestled in the foothills of the Himalayas, this estate is blessed by dense high-altitude mists that slow leaf growth, concentrating rich muscatel and honey grape aromatics.",
  },
  {
    id: "uji",
    name: "Uji Kyoto Gardens",
    country: "Kyoto, Japan",
    elevation: "200m - 350m",
    terroir: "Alluvial river clay, heavy shade canvas covered",
    crop: "Ceremonial Gyokuro Jade Dew",
    coordinates: "34.8906° N, 135.8039° E",
    description: "Located near the Uji river, these rolling mist-kissed hills utilize high-end bamboo straw mats to shade the tea leaves for 20 days prior to plucking, amplifying chlorophyll and savory L-theanine umami.",
  },
  {
    id: "wuyi",
    name: "Wuyi Cliffs",
    country: "Fujian, China",
    elevation: "900m - 1,100m",
    terroir: "Volcanic mineral rock crevices, high morning mist",
    crop: "Phoenix Dancong Oolong",
    coordinates: "27.6496° N, 117.9868° E",
    description: "Tea bushes grow directly inside the steep volcanic rock gorges of the Wuyi Mountains. The resulting tea leaves absorb rich subterranean iron and minerals, imparting a legendary rocky character.",
  },
  {
    id: "ilam",
    name: "Ilam Valleys",
    country: "Ilam, Nepal",
    elevation: "2,100m - 2,400m",
    terroir: "Pristine glacial slate soils, intense UV exposure",
    crop: "Silver Needle Imperial White",
    coordinates: "26.9117° N, 87.9255° E",
    description: "Cultivated in alpine fresh air at the absolute ceiling of tea growth, these pristine slopes receive direct solar intensity, creating velvet down buds rich in protective antioxidants.",
  },
];

export const SourcingMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<SourcingRegion>(REGIONS[0]);

  return (
    <section id="terroirs" className="py-24 md:py-32 px-6 md:px-12 bg-forest text-ivory relative overflow-hidden">
      {/* Background graphic grid lines representing an old map */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(197,168,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(13,31,22,0.9),transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold mb-3 block">
              ESTATE TERROIR
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-ivory font-light leading-tight">
              Single-Origin Terroirs
            </h2>
            <div className="w-12 h-px bg-gold my-4" />
          </div>
          <p className="text-xs text-ivory/60 font-sans tracking-wide leading-relaxed max-w-sm font-light">
            We operate at extreme elevations. High-altitude cultivation subjects our crops to cooler temperatures, forcing the tea plants to synthesize richer, highly concentrated oils.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch min-h-[350px] lg:min-h-[500px]">
          {/* Left Side: Elegant Map Visualization Panel */}
          <div className="lg:w-7/12 bg-forest-dark border border-gold/15 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden min-h-[300px] lg:min-h-auto">
            {/* Compass rose decoration */}
            <div className="absolute -top-12 -right-12 w-48 h-48 opacity-[0.03] text-gold">
              <Compass className="w-full h-full stroke-[1]" />
            </div>

            <div className="flex items-center justify-between border-b border-gold/10 pb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-ivory/60">
                  Global Sourcing Registry Map
                </span>
              </div>
              <span className="text-[9px] font-sans text-gold tracking-widest uppercase font-semibold">
                Altitude Scaled
              </span>
            </div>

            {/* Simulated stylized geography plot */}
            <div className="flex-1 flex items-center justify-center py-12 relative min-h-[300px]">
              {/* Abstract land shapes or paths using circles */}
              <div className="absolute w-[80%] h-[70%] border border-gold/5 rounded-full border-dashed" />
              <div className="absolute w-[50%] h-[40%] border border-gold/5 rounded-full" />
              
              {/* Region Map Pins */}
              {REGIONS.map((region, idx) => {
                const isActive = region.id === selectedRegion.id;
                
                // Absolute positioning offsets for premium layout
                const positions = [
                  { top: "60%", left: "30%" }, // Darjeeling
                  { top: "45%", left: "68%" }, // Uji Kyoto
                  { top: "35%", left: "50%" }, // Wuyi
                  { top: "50%", left: "20%" }, // Nepal Ilam
                ];

                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className="absolute group flex items-center gap-2.5 transition-all duration-500 cursor-pointer"
                    style={positions[idx]}
                  >
                    <div className="relative flex items-center justify-center">
                      {isActive && (
                        <span className="absolute w-6 h-6 rounded-full border border-gold/40 animate-[ping_1.5s_infinite]" />
                      )}
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all duration-500 ${
                        isActive 
                          ? "bg-gold border-gold text-forest" 
                          : "bg-forest-dark border-gold/30 text-gold group-hover:bg-gold/10 group-hover:border-gold"
                      }`}>
                        <MapPin className="w-2 h-2" />
                      </div>
                    </div>
                    <span className={`text-[10px] font-sans uppercase tracking-widest font-semibold transition-all duration-300 ${
                      isActive ? "text-gold" : "text-ivory/40 group-hover:text-ivory"
                    }`}>
                      {region.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Technical location coordinates banner */}
            <div className="border-t border-gold/10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[9px] font-sans text-ivory/40 tracking-wider">
              <span>PLOT: {selectedRegion.coordinates}</span>
              <span>ELEV: {selectedRegion.elevation}</span>
            </div>
          </div>

          {/* Right Side: Estate Details Overlay Box (Ivory Luxury Card) */}
          <div className="lg:w-5/12 bg-ivory text-forest p-6 md:p-10 flex flex-col justify-between border border-gold/30 relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="gold">{selectedRegion.country}</Badge>
                <span className="text-[10px] font-sans uppercase text-gold font-bold tracking-widest">
                  {selectedRegion.elevation}
                </span>
              </div>

              <h3 className="text-3xl font-serif text-forest tracking-wide leading-snug">
                {selectedRegion.name}
              </h3>
              <p className="text-[10px] font-sans text-gold-dark uppercase tracking-widest font-bold mt-1">
                Signature Yield: {selectedRegion.crop}
              </p>
              
              <div className="w-12 h-px bg-gold/40 my-6" />

              <div className="flex flex-col gap-4 text-xs font-sans font-light leading-relaxed text-forest/80">
                <p>{selectedRegion.description}</p>
                
                <div className="bg-forest/5 p-4 border border-gold/10 flex flex-col gap-2 mt-2">
                  <span className="text-[9px] font-sans uppercase tracking-widest font-bold text-gold-dark">
                    Terroir & Climate Index
                  </span>
                  <p className="text-[11px] font-sans text-forest/70 leading-normal italic">
                    {selectedRegion.terroir}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick slide selector helper */}
            <div className="mt-8 pt-6 border-t border-gold/10 flex items-center justify-between">
              <span className="text-[9px] font-sans uppercase tracking-widest text-forest/40">
                Collector Allocation
              </span>
              <a
                href="#collections"
                className="inline-flex items-center gap-1.5 text-[9px] font-sans font-bold uppercase tracking-widest text-gold hover:text-gold-dark transition-all duration-300"
              >
                Reserve harvest crop <ArrowRight className="w-3 h-3 text-gold" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
