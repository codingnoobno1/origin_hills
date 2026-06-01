import React from "react";
import { Timer, Thermometer, Sprout, Award } from "lucide-react";

interface SteepingStatsProps {
  stats: {
    hoursSteeped: number;
    averageTemp: string;
    favoriteVarietal: string;
    tastingScore: number;
  };
}

export const SteepingStats: React.FC<SteepingStatsProps> = ({ stats }) => {
  const cards = [
    {
      title: "Steeping Hours",
      value: `${stats.hoursSteeped} hrs`,
      subtitle: "Active session logs",
      icon: <Timer className="w-4 h-4 text-gold" />,
    },
    {
      title: "Mean Extraction",
      value: stats.averageTemp,
      subtitle: "Target optimal heat",
      icon: <Thermometer className="w-4 h-4 text-gold" />,
    },
    {
      title: "Cellar Preference",
      value: stats.favoriteVarietal.split(" ")[0] + " " + (stats.favoriteVarietal.split(" ")[1] || ""),
      subtitle: "Active sourcing slope",
      icon: <Sprout className="w-4 h-4 text-gold" />,
    },
    {
      title: "Tasting Score",
      value: `${stats.tastingScore}/100`,
      subtitle: "Sommelier maturity",
      icon: <Award className="w-4 h-4 text-gold" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-ivory border border-gold/10 p-5 flex items-start justify-between relative overflow-hidden animate-fade-slide-up"
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          <div className="flex flex-col">
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-forest/40">
              {card.title}
            </span>
            <span className="text-xl font-serif text-forest mt-2 mb-0.5 tracking-tight font-medium">
              {card.value}
            </span>
            <span className="text-[9px] font-sans text-forest/40 leading-none">
              {card.subtitle}
            </span>
          </div>

          <div className="p-1.5 bg-forest/5 border border-gold/10 rounded-none flex items-center justify-center">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
