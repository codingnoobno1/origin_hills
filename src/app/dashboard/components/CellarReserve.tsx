import React from "react";
import { Badge } from "@/components/portfolio/ui-elements";
import { Heart, Snowflake, Sparkles } from "lucide-react";

interface CellarItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reservedAt: string;
}

interface CellarReserveProps {
  reserves: CellarItem[];
}

export const CellarReserve: React.FC<CellarReserveProps> = ({ reserves }) => {
  return (
    <div className="bg-ivory border border-gold/15 p-6 shadow-sm relative overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <h3 className="text-base font-serif text-forest tracking-wide font-medium">
            Your Cellar Reserves
          </h3>
          <p className="text-[10px] text-forest/40 font-sans tracking-wide mt-0.5">
            Active vacuum-sealed allocations protected in the Origin Hills reserve vaults
          </p>
        </div>
        <Badge variant="gold">Ledger Verified</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reserves.length === 0 ? (
          <div className="col-span-2 py-8 text-center text-forest/40 border border-dashed border-gold/20 p-6 bg-forest/5">
            No active allocations. Select micro-crop reserves on the home catalog to request vault holdings.
          </div>
        ) : (
          reserves.map((item, idx) => (
            <div
              key={idx}
              className="bg-ivory-light border border-gold/10 p-5 flex flex-col justify-between hover:border-gold/30 hover:shadow-md transition-all duration-300 relative"
            >
              {/* Decorative ornament */}
              <div className="absolute top-4 right-4 text-gold/20">
                <Snowflake className="w-4 h-4" />
              </div>

              <div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-gold-dark">
                  {item.category} Tea ✦ Lot #{item.id.substring(0,4).toUpperCase()}
                </span>
                <h4 className="text-lg font-serif text-forest tracking-wide mt-1.5 font-medium leading-snug">
                  {item.name}
                </h4>
                <p className="text-[10px] text-forest/45 font-sans tracking-wide mt-2">
                  Acquired Allocation Date: {new Date(item.reservedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gold/5 flex items-center justify-between">
                <span className="text-xs font-sans text-forest/60">
                  Reserves Count:
                </span>
                <span className="text-sm font-sans font-bold text-forest tracking-wider">
                  {item.quantity} {item.quantity === 1 ? "Tin" : "Tins"} <span className="text-[10px] font-normal text-forest/40">(50g)</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
