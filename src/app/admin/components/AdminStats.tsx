import React from "react";
import { Users, ShoppingBag, MapPin, Gauge } from "lucide-react";

interface AdminStatsProps {
  stats: {
    totalCollectors: number;
    activeReservations: number;
    approvedAllocations: number;
    pendingAllocations: number;
  };
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const cards = [
    { title: "Collectors", value: stats.totalCollectors, sub: `${stats.approvedAllocations} approved`, icon: <Users className="w-4 h-4 text-gold" />, accent: "bg-emerald-500/10 text-emerald-700" },
    { title: "Tins Reserved", value: stats.activeReservations, sub: "Total allocated", icon: <ShoppingBag className="w-4 h-4 text-gold" />, accent: "bg-blue-500/10 text-blue-700" },
    { title: "Pending", value: stats.pendingAllocations, sub: "Needs review", icon: <Gauge className="w-4 h-4 text-amber-500" />, accent: "bg-amber-500/10 text-amber-700", pulse: stats.pendingAllocations > 0 },
    { title: "Terroir Plots", value: "4", sub: "Single-estate", icon: <MapPin className="w-4 h-4 text-gold" />, accent: "bg-purple-500/10 text-purple-700" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-ivory border border-gold/15 p-4 sm:p-5 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold/25" />
          <div className="flex items-start justify-between gap-2">
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-forest/50 leading-tight">{card.title}</span>
            <div className="p-1.5 bg-forest/5 border border-gold/10 flex-shrink-0">{card.icon}</div>
          </div>
          <div className="flex items-end justify-between gap-2">
            <span className={`text-2xl sm:text-3xl font-sans font-light text-forest tracking-tight ${card.pulse ? "text-amber-600" : ""}`}>
              {card.value}
            </span>
          </div>
          <span className="text-[10px] font-sans text-forest/40 tracking-wide">{card.sub}</span>
        </div>
      ))}
    </div>
  );
};
