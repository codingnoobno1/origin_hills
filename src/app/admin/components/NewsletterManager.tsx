"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Mail } from "lucide-react";

interface Subscriber { email: string; name?: string; subscribedAt: string; }

interface NewsletterManagerProps { onToast: (msg: string) => void; }

export const NewsletterManager: React.FC<NewsletterManagerProps> = ({ onToast }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/newsletter")
      .then((r) => r.json())
      .then((d) => setSubscribers(d.subscribers || []))
      .catch(() => onToast("Failed to load subscribers"))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (email: string) => {
    if (!confirm(`Remove ${email} from newsletter?`)) return;
    try {
      await fetch("/api/admin/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribers((prev) => prev.filter((s) => s.email !== email));
      onToast(`${email} removed from newsletter`);
    } catch {
      onToast("Failed to remove subscriber");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-serif text-forest tracking-wide">Newsletter Subscribers</h3>
        <p className="text-[10px] text-forest/40 font-sans tracking-widest uppercase mt-0.5">{subscribers.length} active subscribers</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-forest/40 font-sans text-xs animate-pulse">Loading subscribers…</div>
      ) : subscribers.length === 0 ? (
        <div className="p-16 text-center bg-ivory border border-gold/15 flex flex-col items-center gap-3">
          <Mail className="w-8 h-8 text-gold/30" />
          <p className="text-forest/40 font-sans text-xs tracking-widest uppercase">No subscribers yet</p>
        </div>
      ) : (
        <div className="bg-ivory border border-gold/15 overflow-hidden divide-y divide-gold/5">
          {subscribers.map((s, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-forest/5 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-forest text-sm truncate">{s.email}</p>
                <p className="text-[10px] text-forest/45 mt-0.5">{s.name || "—"} · {new Date(s.subscribedAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => remove(s.email)} className="p-2.5 text-forest/30 hover:text-red-600 cursor-pointer transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
