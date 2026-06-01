"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";

interface Order {
  _id: string;
  userEmail: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
  note?: string;
}

const STATUS_OPTIONS = ["Pending Review", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"];

const statusColor = (s: string) => {
  if (s === "Delivered")  return "bg-green-500/10 text-green-700 border-green-500/25";
  if (s === "Confirmed" || s === "Processing") return "bg-blue-500/10 text-blue-700 border-blue-500/25";
  if (s === "Dispatched") return "bg-purple-500/10 text-purple-700 border-purple-500/25";
  if (s === "Cancelled")  return "bg-red-500/10 text-red-700 border-red-500/25";
  return "bg-amber-500/10 text-amber-700 border-amber-500/25";
};

interface OrderManagerProps { onToast: (msg: string) => void; }

export const OrderManager: React.FC<OrderManagerProps> = ({ onToast }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => onToast("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
      onToast(`Order → ${status}`);
    } catch { onToast("Update failed"); }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-xl font-serif text-forest font-light">Allocation Orders</h3>
        <p className="text-[10px] text-forest/40 font-sans tracking-widest uppercase mt-0.5">{orders.length} total orders</p>
      </div>

      {loading ? (
        <div className="bg-ivory border border-gold/15 p-12 text-center text-forest/40 font-sans text-xs animate-pulse">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="bg-ivory border border-gold/15 p-14 flex flex-col items-center gap-3 text-center">
          <ShoppingBag className="w-8 h-8 text-gold/25" />
          <p className="text-forest/40 font-sans text-xs tracking-widest uppercase">No orders yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o._id} className="bg-ivory border border-gold/15 overflow-hidden">
              {/* Card Header */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-forest text-sm truncate">{o.userEmail}</p>
                    <p className="text-[10px] text-forest/45 mt-0.5">{new Date(o.createdAt).toLocaleDateString()} · {o.items?.length || 0} item(s)</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-forest text-sm">${o.total?.toFixed(2)}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </div>
                </div>

                {/* Status selector + expand toggle */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="flex-1 min-w-[140px] text-[11px] font-sans border border-forest/15 bg-white px-3 py-2.5 text-forest focus:outline-none focus:border-gold cursor-pointer min-h-[40px]"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                    className="flex items-center gap-1.5 px-3 py-2.5 border border-gold/20 text-[10px] font-sans font-semibold uppercase tracking-wider text-forest/60 hover:text-forest cursor-pointer min-h-[40px] transition-colors"
                  >
                    {expanded === o._id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    Items
                  </button>
                </div>
              </div>

              {/* Expanded items */}
              {expanded === o._id && (
                <div className="border-t border-gold/10 bg-forest/5 px-4 py-3 flex flex-col gap-2">
                  <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-forest/40 mb-1">Order Items</p>
                  {(o.items || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-sans text-forest/80 pb-1.5 border-b border-gold/10 last:border-0">
                      <span>{item.name} × {item.qty}</span>
                      <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  {o.note && <p className="text-[11px] text-forest/50 font-sans italic mt-1">Note: {o.note}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
