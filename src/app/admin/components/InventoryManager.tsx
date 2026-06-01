import React from "react";
import { Badge } from "@/components/portfolio/ui-elements";

interface InventoryManagerProps {
  collectors: any[];
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ collectors }) => {
  // Count preferences
  const getCapacityCount = (preference: string) => {
    return collectors
      .filter((c) => c.preference === preference && c.allocationStatus === "Approved")
      .reduce((acc, c) => acc + (c.allocationTins || 1), 0);
  };

  const inventories = [
    {
      name: "Silver Needle Imperial",
      category: "White Tea (Ilam, Nepal)",
      allocated: getCapacityCount("rare"),
      limit: 150,
      color: "bg-gold",
    },
    {
      name: "Phoenix Cliff Oolong",
      category: "Oolong Tea (Wuyi, China)",
      allocated: getCapacityCount("rare-blends"),
      limit: 100,
      color: "bg-sage",
    },
    {
      name: "Makaibari First Flush",
      category: "Black Tea (Darjeeling, India)",
      allocated: getCapacityCount("black"),
      limit: 120,
      color: "bg-forest",
    },
    {
      name: "Gyokuro Jade Dew",
      category: "Green Tea (Kyoto, Japan)",
      allocated: 0, // Shaded, strictly allocated on demand
      limit: 80,
      color: "bg-forest-light",
    },
  ];

  return (
    <div className="bg-ivory border border-gold/15 p-6 shadow-sm relative overflow-hidden animate-fade-in">
      <h3 className="text-base font-serif text-forest tracking-wide font-medium mb-1">
        Sourcing Allocation Capacity
      </h3>
      <p className="text-[10px] text-forest/40 font-sans tracking-wide mb-6">
        Tracks seasonal crop allocation saturation bounds. Maximum limits are determined by annual crop yield estimates.
      </p>

      <div className="flex flex-col gap-5">
        {inventories.map((inv, idx) => {
          const pct = Math.min(100, Math.round((inv.allocated / inv.limit) * 100)) || 5; // default minimal display bar
          
          return (
            <div key={idx} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-serif font-bold text-forest leading-snug">
                    {inv.name}
                  </h4>
                  <span className="text-[9px] font-sans text-forest/45 uppercase tracking-wider block">
                    {inv.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-sans font-bold text-forest">
                    {inv.allocated} / {inv.limit} tins
                  </span>
                  <span className="text-[9px] font-sans font-bold text-gold-dark uppercase tracking-widest block mt-0.5">
                    {pct}% Saturation
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-forest/5 relative border border-gold/5">
                <div
                  className={`h-full ${inv.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
