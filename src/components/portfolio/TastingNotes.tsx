import React, { useState } from "react";
import { Compass, Wind, Sunset, Sparkles, Sprout } from "lucide-react";

interface NoteDetail {
  id: string;
  name: string;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
  example: string;
}

const NOTES: NoteDetail[] = [
  {
    id: "aromatic",
    name: "Volatile Aromatics",
    icon: <Wind className="w-5 h-5 text-gold" />,
    subtitle: "High-flying top notes of dry leaf & wet wash",
    description: "Detected immediately upon steeping, these delicate esters and essential oils drift from the warm lid of the vessel. Notes include fresh meadows, damp pine needle, and citrus zest.",
    example: "Featured prominently in: Silver Needle White",
  },
  {
    id: "mineral",
    name: "Cliffs & Clay Terroir",
    icon: <Compass className="w-5 h-5 text-gold" />,
    subtitle: "Mineral rock compounds of volcanic slate soils",
    description: "The metallic, cold slate sensation felt on the sides of the tongue. High elevation rocky roots pull trace minerals that give the tea a structured, crisp dryness comparable to grand cru wines.",
    example: "Featured prominently in: Wuyi Cliffs Oolong",
  },
  {
    id: "floral",
    name: "Esther Florals",
    icon: <Sunset className="w-5 h-5 text-gold" />,
    subtitle: "Sweet blossom bouquets of gentle oxidation",
    description: "The sweet, lingering scent of orchids, lilies, or muscatel grapes that lingers at the back of the throat long after the tea is swallowed. Perfect oxidation balance yields deep floral blooms.",
    example: "Featured prominently in: First Flush Darjeeling",
  },
  {
    id: "umami",
    name: "Savory L-Theanine",
    icon: <Sparkles className="w-5 h-5 text-gold" />,
    subtitle: "Chlorophyll-driven rich amino acid umami",
    description: "A thick, brothy sensation that coats the palate, resembling warm broth or sweet sea spray. Achieved by shading the tea leaves, which triggers intense concentration of amino acids.",
    example: "Featured prominently in: Gyokuro Jade Green",
  },
];

export const TastingNotes: React.FC = () => {
  const [activeNote, setActiveNote] = useState<NoteDetail>(NOTES[0]);

  return (
    <section className="py-20 md:py-24 bg-ivory relative border-t border-gold/15">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Sub-Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold mb-3.5 block">
            CONNOISSEUR LITERACY
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif text-forest tracking-wide">
            Deciphering Tea Volatiles
          </h3>
          <div className="w-10 h-px bg-gold/50 mx-auto my-4" />
        </div>

        {/* Dynamic Selector Split View */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch max-w-4xl mx-auto border border-gold/15 bg-ivory-light p-6 md:p-10">
          {/* Left Notes Tabs */}
          <div className="md:w-5/12 flex flex-col gap-3 justify-center">
            {NOTES.map((note) => {
              const isActive = note.id === activeNote.id;
              return (
                <button
                  key={note.id}
                  onClick={() => setActiveNote(note)}
                  className={`flex items-center gap-4 py-4 px-5 text-left border transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? "bg-forest border-forest text-ivory shadow-md" 
                      : "bg-ivory border-forest/5 text-forest/70 hover:border-gold/30 hover:bg-ivory-light"
                  }`}
                >
                  <div className={`p-2 border rounded-none transition-colors duration-500 ${
                    isActive ? "border-gold/30 bg-forest-dark" : "border-forest/10 bg-forest/5"
                  }`}>
                    {note.icon}
                  </div>
                  <div>
                    <h4 className={`text-xs font-sans font-bold uppercase tracking-wider ${
                      isActive ? "text-ivory" : "text-forest"
                    }`}>
                      {note.name.split(" ")[0]}
                    </h4>
                    <span className={`text-[9px] font-sans ${
                      isActive ? "text-gold/80" : "text-forest/40"
                    }`}>
                      {note.name.split(" ").slice(1).join(" ")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Notes Info display card */}
          <div className="md:w-7/12 bg-ivory p-6 md:p-8 border border-gold/15 flex flex-col justify-between animate-fade-in">
            <div>
              <span className="text-[9px] font-sans font-bold text-gold uppercase tracking-[0.2em] mb-1.5 block">
                Tasting Dimension Detail
              </span>
              <h4 className="text-xl font-serif text-forest tracking-wide">
                {activeNote.name}
              </h4>
              <p className="text-[10px] text-forest/40 font-sans uppercase tracking-widest font-semibold mt-0.5 mb-4 italic">
                {activeNote.subtitle}
              </p>
              
              <div className="w-8 h-px bg-gold/50 my-4" />

              <p className="text-xs text-forest/70 font-sans leading-relaxed tracking-wide font-light">
                {activeNote.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gold/10 flex items-center gap-2">
              <Sprout className="w-3.5 h-3.5 text-gold" />
              <span className="text-[10px] font-sans font-bold uppercase text-gold-dark tracking-wide italic">
                {activeNote.example}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
