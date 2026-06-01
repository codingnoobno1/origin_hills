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
        <div className="bg-ivory border border-gold/15 overflow-hidden">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-gold/15 bg-forest/5 text-forest/50 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Subscribed</th>
                <th className="py-3 px-4 text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {subscribers.map((s, i) => (
                <tr key={i} className="hover:bg-forest/5 transition-colors">
                  <td className="py-3 px-4 text-forest font-semibold">{s.email}</td>
                  <td className="py-3 px-4 text-forest/60">{s.name || "—"}</td>
                  <td className="py-3 px-4 text-forest/50">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => remove(s.email)} className="p-1.5 text-forest/30 hover:text-red-600 cursor-pointer transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
