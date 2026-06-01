import React, { useEffect } from "react";
import { Info, CheckCircle2, X } from "lucide-react";

interface LuxuryToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const LuxuryToast: React.FC<LuxuryToastProps> = ({
  message,
  onClose,
  duration = 3500,
}) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up flex items-center gap-3 bg-glass-forest text-ivory border border-gold/45 px-5 py-4 shadow-2xl max-w-sm">
      <div className="p-1 bg-gold/15 rounded-full flex-shrink-0">
        <CheckCircle2 className="w-4 h-4 text-gold" />
      </div>
      
      <div className="flex-1">
        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-gold block">
          Registry Action Verified
        </span>
        <p className="text-[11px] text-ivory/80 font-sans tracking-wide leading-relaxed mt-0.5">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-ivory/30 hover:text-ivory p-0.5 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5 stroke-[1.5]" />
      </button>
    </div>
  );
};
