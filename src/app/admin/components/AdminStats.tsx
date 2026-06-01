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
    {
      title: "Allocated Collectors",
      value: stats.totalCollectors,
      subtitle: `${stats.approvedAllocations} approved reserves`,
      icon: <Users className="w-5 h-5 text-gold" />,
    },
    {
      title: "Active Tins Reserved",
      value: stats.activeReservations,
      subtitle: "Out of 500 seasonal cap",
      icon: <ShoppingBag className="w-5 h-5 text-gold" />,
    },
    {
      title: "Pending Allocations",
      value: stats.pendingAllocations,
      subtitle: "Requires master review",
      icon: <Gauge className="w-5 h-5 text-gold animate-[pulse_2s_infinite]" />,
    },
    {
      title: "Active Terroir Slopes",
      value: "4 Plots",
      subtitle: "100% single-estate plots",
      icon: <MapPin className="w-5 h-5 text-gold" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-ivory border border-gold/15 p-6 flex items-start justify-between shadow-sm relative overflow-hidden animate-fade-slide-up"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Subtle gold line accent */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gold/30" />
          
          <div className="flex flex-col">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-forest/50">
              {card.title}
            </span>
            <span className="text-3xl font-sans font-light text-forest mt-2 mb-1 tracking-tight">
              {card.value}
            </span>
            <span className="text-[10px] font-sans text-forest/40 tracking-wide">
              {card.subtitle}
            </span>
          </div>

          <div className="p-2.5 bg-forest/5 border border-gold/15 rounded-none flex items-center justify-center">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
