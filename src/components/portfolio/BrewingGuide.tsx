import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Thermometer, Droplet, Clock } from "lucide-react";
import { Button } from "./ui-elements";

interface RitualParameter {
  id: string;
  name: string;
  type: string;
  temp: number;
  timeSec: number;
  leavesGrams: number;
  vessel: string;
  description: string;
}

const RITUALS: RitualParameter[] = [
  {
    id: "white",
    name: "Silver Needle White",
    type: "Imperial Down Buds",
    temp: 80,
    timeSec: 240,
    leavesGrams: 3,
    vessel: "Pre-warmed Glass or Gaiwan",
    description: "Requires cool, delicate spring water. Avoid boiling water to preserve the fragile trichomes (silver hairs) which coat the white buds, releasing sweet, fresh hay and cucumber aromas.",
  },
  {
    id: "green",
    name: "Gyokuro Jade Green",
    type: "Shaded Tencha leaf",
    temp: 60,
    timeSec: 120,
    leavesGrams: 5,
    vessel: "Shiboridashi or Kyusu Claypot",
    description: "Brewed at highly cooled temperatures with high concentration leaf ratios. This unlocks the intense savory brothy umami, rich amino acids, and a thick seaweed liquor consistency.",
  },
  {
    id: "black",
    name: "First Flush Darjeeling",
    type: "Tippy Golden Flowery Orange Pekoe",
    temp: 90,
    timeSec: 180,
    leavesGrams: 3,
    vessel: "Fine Porcelain Teapot",
    description: "High mountain spring water just off boil. Triggers the release of complex muscatel volatile compounds, fresh green grapes, and a slightly astringent, sparkling champagne finish.",
  },
  {
    id: "oolong",
    name: "Wuyi Cliffs Oolong",
    type: "Heavy Roasted Cliff Leaves",
    temp: 95,
    timeSec: 45,
    leavesGrams: 6,
    vessel: "Yixing Purple Zisha Clay",
    description: "Requires flash-brews inside pre-heated porous clay vessels. The high heat forces intense orchids, toasted almond, charcoal smoke, and lingering volcanic stone minerality in consecutive short steeps.",
  },
];

export const BrewingGuide: React.FC = () => {
  const [selectedRitual, setSelectedRitual] = useState<RitualParameter>(RITUALS[0]);
  const [waterVolMl, setWaterVolMl] = useState<number>(200);
  const [timeLeft, setTimeLeft] = useState<number>(RITUALS[0].timeSec);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Sync timer when selected tea changes
  useEffect(() => {
    setTimeLeft(selectedRitual.timeSec);
    setTimerRunning(false);
  }, [selectedRitual]);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleReset = () => {
    setTimerRunning(false);
    setTimeLeft(selectedRitual.timeSec);
  };

  // Adjust recommended leaf weight based on water volume select
  const calculatedLeaves = ((selectedRitual.leavesGrams / 200) * waterVolMl).toFixed(1);

  return (
    <section id="ritual" className="py-16 md:py-32 px-4 md:px-12 bg-ivory-dark relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold mb-3 block">
            STEEPING MANIFESTO
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-forest font-light leading-tight">
            The Steeping Ritual
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto my-6" />
          <p className="text-xs sm:text-sm text-forest/60 font-sans tracking-wide leading-relaxed max-w-lg mx-auto font-light">
            Steeping is the fine art of extraction. Adjust water volume and track physical steeping parameters under our guided digital timer to achieve master culinary clarity.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          {/* Left Panel: Selector and Info */}
          <div className="lg:w-7/12 flex flex-col justify-between bg-ivory p-6 md:p-12 border border-gold/15">
            <div>
              <span className="text-[9px] font-sans font-bold text-gold uppercase tracking-[0.2em] mb-4 block">
                Select Tea Varietal
              </span>
              
              {/* Tea Select buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {RITUALS.map((ritual) => (
                  <button
                    key={ritual.id}
                    onClick={() => setSelectedRitual(ritual)}
                    className={`py-3 px-2 min-h-[44px] border text-center transition-all duration-300 cursor-pointer text-[10px] font-sans font-semibold uppercase tracking-wider ${
                      selectedRitual.id === ritual.id
                        ? "bg-forest text-ivory border-forest"
                        : "bg-ivory-light border-forest/10 text-forest/60 hover:border-forest/20"
                    }`}
                  >
                    {ritual.name.split(" ")[0]} {ritual.name.split(" ")[1] || ""}
                  </button>
                ))}
              </div>

              {/* Ritual Details */}
              <div className="animate-fade-in">
                <span className="text-[9px] font-sans font-bold text-gold uppercase tracking-widest block mb-1">
                  Varietal Character
                </span>
                <h3 className="text-2xl font-serif text-forest mb-2">
                  {selectedRitual.name}
                </h3>
                <p className="text-[10px] text-forest/50 font-sans uppercase tracking-widest font-semibold mb-4">
                  CLASSIFICATION: {selectedRitual.type}
                </p>
                <p className="text-xs text-forest/75 font-sans leading-relaxed tracking-wide font-light">
                  {selectedRitual.description}
                </p>
              </div>
            </div>

            {/* Sliding adjustments for Water Vol */}
            <div className="mt-8 pt-6 border-t border-gold/10">
              <div className="flex justify-between items-center text-[10px] font-sans font-bold text-forest/60 uppercase tracking-widest mb-3">
                <span>Water Volume</span>
                <span className="text-forest">{waterVolMl} ml</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="50"
                value={waterVolMl}
                onChange={(e) => setWaterVolMl(Number(e.target.value))}
                className="w-full accent-gold bg-forest/10 h-1 cursor-pointer outline-none transition-all"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col">
                  <span className="text-[9px] font-sans uppercase tracking-widest text-forest/40">
                    Calculated dry leaves
                  </span>
                  <span className="text-sm font-sans font-bold text-forest mt-0.5">
                    {calculatedLeaves} grams
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-sans uppercase tracking-widest text-forest/40">
                    Steeping Vessel
                  </span>
                  <span className="text-xs font-sans font-semibold text-forest mt-0.5 leading-snug">
                    {selectedRitual.vessel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Digital Steeping Timer Dashboard */}
          <div className="lg:w-5/12 bg-forest text-ivory p-6 md:p-12 flex flex-col justify-between border border-gold/20 relative overflow-hidden">
            {/* Visual ambient pulse */}
            {timerRunning && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.06),transparent_60%)] animate-[pulse_3s_infinite]" />
            )}

            <div className="relative z-10 flex items-center justify-between border-b border-ivory/10 pb-4">
              <span className="text-[9px] font-sans uppercase tracking-widest text-ivory/40">
                Digital Extraction Monitor
              </span>
              <span className={`text-[9px] font-sans uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                timerRunning 
                  ? "bg-gold/10 border-gold text-gold" 
                  : "bg-ivory/5 border-ivory/10 text-ivory/40"
              }`}>
                {timerRunning ? "Active Extract" : "Ready"}
              </span>
            </div>

            {/* Giant Circular Digital Timer Display */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-12">
              <div className="relative w-48 h-48 rounded-full border border-gold/15 flex flex-col items-center justify-center bg-forest-dark/40 shadow-inner">
                {/* Circular timer progress effect */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="92"
                    stroke="rgba(197,168,128,0.05)"
                    strokeWidth="2"
                    fill="transparent"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="92"
                    stroke="#C5A880"
                    strokeWidth="2"
                    fill="transparent"
                    strokeDasharray={578}
                    strokeDashoffset={578 - (578 * (timeLeft / selectedRitual.timeSec))}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                <Clock className="w-5 h-5 text-gold/60 mb-1" />
                <span className="text-4xl font-sans font-extralight tracking-widest text-ivory leading-none">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[9px] font-sans uppercase tracking-widest text-ivory/40 mt-1">
                  Target Steeping
                </span>
              </div>

              {/* Live Parameters Indicator */}
              <div className="flex gap-8 mt-6">
                <div className="flex items-center gap-1.5 text-xs font-sans text-ivory/70">
                  <Thermometer className="w-4 h-4 text-gold" />
                  <span>{selectedRitual.temp}°C</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-sans text-ivory/70">
                  <Droplet className="w-4 h-4 text-gold" />
                  <span>{waterVolMl}ml</span>
                </div>
              </div>
            </div>

            {/* Control Board */}
            <div className="relative z-10 border-t border-ivory/10 pt-6 flex items-center justify-center gap-4">
              <button
                onClick={handleReset}
                className="p-3 border border-ivory/15 bg-ivory/5 hover:bg-ivory/10 hover:border-ivory/40 transition-all rounded-none cursor-pointer"
                title="Reset Steeping"
              >
                <RotateCcw className="w-4 h-4 text-ivory" />
              </button>

              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`flex items-center gap-2 px-8 py-3 uppercase tracking-widest text-xs font-sans transition-all duration-300 cursor-pointer ${
                  timerRunning
                    ? "bg-transparent border border-gold text-gold hover:bg-gold/5"
                    : "bg-gold border border-gold text-forest hover:bg-gold-light"
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4.5 h-4.5 fill-current" />
                    Halt Extraction
                  </>
                ) : (
                  <>
                    <Play className="w-4.5 h-4.5 fill-current" />
                    Commence Steep
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
