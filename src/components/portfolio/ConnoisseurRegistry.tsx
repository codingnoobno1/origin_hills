import React, { useState } from "react";
import { Button } from "./ui-elements";

export const ConnoisseurRegistry: React.FC = () => {
  const [email, setEmail] = useState("");
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegistered(true);
      setEmail("");
    }, 1200);
  };

  return (
    <section className="py-24 bg-forest text-ivory relative overflow-hidden border-t border-gold/15">
      {/* Background soft lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.05),transparent_60%)]" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-gold mb-4 block">
          MEMBERSHIP REGISTRY
        </span>
        
        <h2 className="text-3xl sm:text-5xl font-serif text-ivory font-light mb-4">
          The Connoisseur's Cellar Registry
        </h2>
        
        <p className="text-xs text-ivory/60 font-sans tracking-wide leading-relaxed max-w-md mx-auto mb-10 font-light">
          Subscribe to acquire priority notifications regarding limited seasonal flushes, private laboratory cuvees, and single-origin tea allocations.
        </p>

        {registered ? (
          <div className="p-6 bg-forest-dark border border-gold/20 inline-block max-w-md animate-slide-up">
            <span className="text-gold text-lg mb-1 block">✦</span>
            <h4 className="text-sm font-serif text-ivory uppercase tracking-widest font-bold">
              Cellar Registration Pending
            </h4>
            <p className="text-[10px] text-ivory/50 font-sans mt-2 leading-relaxed">
              We have recorded your email credential. Exclusive release notifications will be allocated directly to your queue.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 justify-center items-stretch max-w-md mx-auto border border-gold/10 p-2 bg-forest-dark/40"
          >
            <input
              type="email"
              placeholder="e.g. collector@originhills.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-transparent border-0 px-4 py-3 text-xs text-ivory placeholder:text-ivory/20 focus:outline-none flex-1 font-sans focus:ring-0"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={loading}
              className="px-6 cursor-pointer font-bold"
            >
              {loading ? "Registering..." : "Join Registry"}
            </Button>
          </form>
        )}

        <div className="text-[9px] font-sans text-ivory/30 tracking-widest uppercase mt-6">
          ✦ COMPLIMENTARY MEMBERSHIP ALLOCATION ✦ ZERO SOLICITATION GUARANTEE ✦
        </div>
      </div>
    </section>
  );
};
