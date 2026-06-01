import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TimelineItem {
  title: string;
  date: string;
  status: string; // "completed" | "active" | "pending"
}

interface AllocationHistoryProps {
  history: TimelineItem[];
}

export const AllocationHistory: React.FC<AllocationHistoryProps> = ({ history }) => {
  return (
    <div className="bg-ivory border border-gold/15 p-6 shadow-sm relative overflow-hidden animate-fade-in">
      <h3 className="text-base font-serif text-forest tracking-wide font-medium mb-1">
        Allocation Maturity Timeline
      </h3>
      <p className="text-[10px] text-forest/40 font-sans tracking-wide mb-6">
        Tracks your chronological relationship maturity checkpoints with Origin Hills
      </p>

      <div className="relative flex flex-col gap-6 pl-6 border-l border-gold/20 ml-3">
        {history.map((item, idx) => {
          const isDone = item.status === "completed";
          const isActive = item.status === "active";
          
          return (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-0.5 z-10 bg-ivory p-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-green-700 fill-green-500/10" />
                ) : isActive ? (
                  <Clock className="w-4 h-4 text-gold animate-[spin_4s_infinite]" />
                ) : (
                  <Circle className="w-4 h-4 text-forest/20 fill-ivory" />
                )}
              </div>

              <div className="flex flex-col">
                <h4 className={`text-xs font-sans uppercase tracking-wider font-semibold ${
                  isActive ? "text-gold" : isDone ? "text-forest" : "text-forest/35"
                }`}>
                  {item.title}
                </h4>
                <span className="text-[9px] font-sans text-forest/40 mt-0.5">
                  Check: {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
