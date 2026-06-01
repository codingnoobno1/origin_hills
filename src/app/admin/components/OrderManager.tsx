"use client";
import React, { useState, useEffect } from "react";

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

interface OrderManagerProps {
  onToast: (msg: string) => void;
}

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
      if (!res.ok) throw new Error("Update failed");
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
      onToast(`Order status updated → ${status}`);
    } catch (e: any) {
      onToast(`Error: ${e.message}`);
    }
  };

  const statusColor = (s: string) => {
    if (s === "Delivered") return "bg-green-500/10 text-green-700 border-green-500/25";
    if (s === "Confirmed" || s === "Processing") return "bg-blue-500/10 text-blue-700 border-blue-500/25";
    if (s === "Dispatched") return "bg-purple-500/10 text-purple-700 border-purple-500/25";
    if (s === "Cancelled") return "bg-red-500/10 text-red-700 border-red-500/25";
    return "bg-amber-500/10 text-amber-700 border-amber-500/25";
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-serif text-forest tracking-wide">Allocation Orders</h3>
        <p className="text-[10px] text-forest/40 font-sans tracking-widest uppercase mt-0.5">{orders.length} orders total</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-forest/40 font-sans text-xs animate-pulse">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="p-16 text-center bg-ivory border border-gold/15 text-forest/40 font-sans text-xs tracking-widest uppercase">No orders yet</div>
      ) : (
        <div className="bg-ivory border border-gold/15 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-forest/5 text-forest/50 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Update</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {orders.map((o) => (
                  <React.Fragment key={o._id}>
                    <tr className="hover:bg-forest/5 transition-all duration-200">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-forest">{o.userEmail}</p>
                        <p className="text-[10px] text-forest/40">{o.items?.length || 0} item(s)</p>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-forest">${o.total?.toFixed(2)}</td>
                      <td className="py-3 px-4 text-forest/60">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusColor(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                          className="text-[10px] font-sans border border-forest/15 bg-ivory px-2 py-1 text-forest focus:outline-none focus:border-gold cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                          className="text-[10px] font-sans font-semibold uppercase tracking-wider text-gold hover:text-gold-dark cursor-pointer transition-colors"
                        >
                          {expanded === o._id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {expanded === o._id && (
                      <tr className="bg-forest/5">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-forest/50">Order Items</p>
                            {(o.items || []).map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-xs font-sans text-forest/80 border-b border-gold/10 pb-1.5">
                                <span>{item.name} × {item.qty}</span>
                                <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                              </div>
                            ))}
                            {o.note && (
                              <p className="text-[11px] text-forest/60 font-sans italic mt-1">Note: {o.note}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
