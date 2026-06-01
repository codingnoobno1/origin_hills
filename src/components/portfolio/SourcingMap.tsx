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
    id: "upper-assam",
    name: "Upper Assam Estates",
    country: "Assam, India",
    elevation: "1,000m - 1,500m",
    terroir: "Monsoon-fed soil, Subtropical climate, Rich mineral composition, Seasonal mountain mist",
    crop: "Premium Orthodox Black Tea",
    coordinates: "27.1825° N, 94.9275° E",
    description: "Nestled within the fertile landscapes of Northeast India, these estates produce teas celebrated globally for their strength, complexity, and aromatic character.",
  },
  {
    id: "dibrugarh",
    name: "Dibrugarh Estates",
    country: "Assam, India",
    elevation: "104m",
    terroir: "Highly fertile alluvial floodplain soil, high tropical rainfall",
    crop: "Balanced Orthodox Sweet Yield",
    coordinates: "27.4728° N, 94.9120° E",
    description: "Renowned for producing teas with a remarkably balanced structure, layered natural sweetness, and complex floral highlights.",
  },
  {
    id: "tinsukia",
    name: "Tinsukia Gardens",
    country: "Assam, India",
    elevation: "116m",
    terroir: "Clayey loam soil rich in organic matter, shaded cover",
    crop: "Bold Aromatic Concentration",
    coordinates: "27.5015° N, 95.3601° E",
    description: "These gardens produce teas of exceptionally bold character, with intense malty depth and outstanding aromatic concentrations.",
  },
  {
    id: "doomdooma",
    name: "Doomdooma Valley",
    country: "Assam, India",
    elevation: "120m",
    terroir: "Deep acidic soil, heavy forest canopy influence",
    crop: "Elegant Smoked Golden Buds",
    coordinates: "27.5611° N, 95.5724° E",
    description: "A specialized terroir that yields orthodox teas with elegant complexity, golden tip concentration, and an extremely refined finish.",
  },
  {
    id: "sivasagar",
    name: "Sivasagar Slopes",
    country: "Assam, India",
    elevation: "95m",
    terroir: "Lowland silty clay, historically cultivated royal estates",
    crop: "Smooth Velvet Aged Orthodox",
    coordinates: "26.9826° N, 94.6312° E",
    description: "Steeped in royal heritage, these historical estates yield teas with exceptionally smooth textures and extraordinary cup depth.",
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
              Assam Heritage Terroirs
            </h2>
            <div className="w-12 h-px bg-gold my-4" />
          </div>
          <p className="text-xs text-ivory/60 font-sans tracking-wide leading-relaxed max-w-sm font-light">
            The finest teas are inseparable from the lands that produce them. The climate, elevation, rainfall, and soil composition of Assam create some of the world's most distinctive tea profiles.
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
                  Assam Heritage Terroirs Sourcing Map
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
                  { top: "45%", left: "45%" }, // Upper Assam
                  { top: "35%", left: "30%" }, // Dibrugarh
                  { top: "30%", left: "60%" }, // Tinsukia
                  { top: "25%", left: "75%" }, // Doomdooma
                  { top: "60%", left: "20%" }, // Sivasagar
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
