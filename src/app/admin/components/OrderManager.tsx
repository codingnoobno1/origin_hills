"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Sparkles,
  ShieldAlert
} from "lucide-react";

interface Order {
  _id: string;
  userEmail: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
  note?: string;
  customerInfo?: {
    fullName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  } | null;
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
  const [dossierOrder, setDossierOrder] = useState<Order | null>(null);

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
                    <p className="font-semibold text-forest text-sm truncate">
                      {o.customerInfo?.fullName || o.userEmail}
                    </p>
                    <p className="text-[10px] text-forest/45 mt-0.5">
                      {new Date(o.createdAt).toLocaleDateString()} · {o.items?.length || 0} item(s) 
                      {o.customerInfo?.city ? ` · Location: ${o.customerInfo.city}, ${o.customerInfo.state}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-forest text-sm">₹{o.total?.toFixed(2)}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </div>
                </div>

                {/* Status selector + expand toggle + dossier card toggle */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="flex-1 min-w-[140px] text-[11px] font-sans border border-forest/15 bg-white px-3 py-2 text-forest focus:outline-none focus:border-gold cursor-pointer min-h-[38px] rounded-none"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>

                  <button
                    onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gold/20 text-[10px] font-sans font-semibold uppercase tracking-wider text-forest/60 hover:text-forest cursor-pointer min-h-[38px] transition-colors"
                  >
                    {expanded === o._id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    Items
                  </button>

                  <button
                    onClick={() => setDossierOrder(o)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gold text-forest text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-gold-light transition-all cursor-pointer min-h-[38px]"
                  >
                    View Dossier
                  </button>
                </div>
              </div>

              {/* Expanded items */}
              {expanded === o._id && (
                <div className="border-t border-gold/10 bg-forest/5 px-4 py-3 flex flex-col gap-2 animate-fade-in">
                  <p className="text-[9px] font-sans font-bold uppercase tracking-widest text-forest/40 mb-1">Order Items</p>
                  {(o.items || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-sans text-forest/80 pb-1.5 border-b border-gold/10 last:border-0">
                      <span>{item.name} × {item.qty}</span>
                      <span className="font-bold">₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  {o.note && <p className="text-[11px] text-forest/50 font-sans italic mt-1">Note: {o.note}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Customer Dossier Card Overlay */}
      {dossierOrder && (
        <div className="fixed inset-0 z-50 bg-forest/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-4xl bg-ivory text-forest border border-gold/30 shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[660px] overflow-hidden animate-slide-up rounded-none">
            
            {/* Close button top right */}
            <button
              onClick={() => setDossierOrder(null)}
              className="absolute top-4 right-4 z-10 p-1.5 bg-ivory-light border border-gold/20 hover:border-gold text-forest/50 hover:text-forest transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Left Column: Collector profile summary */}
            <div className="md:w-2/5 bg-forest text-ivory p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gold/15">
              <div className="space-y-6">
                <div>
                  <span className="text-[8px] font-sans font-bold uppercase tracking-[0.25em] text-gold block">Origin Hills Registry Dossier</span>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center bg-forest-light text-gold text-base font-serif font-bold uppercase">
                      {dossierOrder.customerInfo?.fullName?.charAt(0) || dossierOrder.userEmail.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-medium text-ivory leading-tight truncate max-w-[170px]">
                        {dossierOrder.customerInfo?.fullName || "Guest Collector"}
                      </h4>
                      <p className="text-[9px] font-sans text-sage uppercase tracking-wider mt-1">
                        {dossierOrder.customerInfo ? "Verified Account" : "Guest Checkout"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gold/15 pt-4 space-y-4 text-xs font-sans">
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] uppercase tracking-wider text-sage font-bold">Email Address</p>
                      <p className="font-semibold text-ivory break-all text-[11px] mt-0.5">{dossierOrder.customerInfo?.email || dossierOrder.userEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-sage font-bold">Secure Contact</p>
                      <p className="font-semibold text-ivory text-[11px] mt-0.5">{dossierOrder.customerInfo?.phone || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-sage font-bold">Allocation Date</p>
                      <p className="font-semibold text-ivory text-[11px] mt-0.5">
                        {new Date(dossierOrder.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status control inside Dossier */}
              <div className="mt-8 pt-4 border-t border-gold/15 space-y-2.5">
                <label className="text-[8px] uppercase tracking-wider text-sage font-bold block">Status Workflow</label>
                <select
                  value={dossierOrder.status}
                  onChange={(e) => {
                    updateStatus(dossierOrder._id, e.target.value);
                    setDossierOrder({ ...dossierOrder, status: e.target.value });
                  }}
                  className="w-full text-[11px] font-sans border border-gold/30 bg-forest-light px-3 py-2 text-ivory focus:outline-none focus:border-gold cursor-pointer min-h-[38px] rounded-none"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Right Column: Address and Order Details */}
            <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-ivory">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                  <h3 className="font-serif text-sm uppercase text-forest tracking-wider">
                    Shipment & Reserve Dossier
                  </h3>
                  <span className="text-[9px] font-sans text-forest/40 uppercase tracking-widest font-bold">
                    Order ID: {dossierOrder._id}
                  </span>
                </div>

                {/* Shipping Details */}
                <div className="space-y-2">
                  <h4 className="text-[9px] font-sans font-bold uppercase tracking-widest text-forest/40">Vault Delivery Address</h4>
                  {dossierOrder.customerInfo ? (
                    <div className="bg-ivory-light border border-gold/15 p-4 space-y-1 text-xs">
                      <p className="font-bold text-forest text-sm">{dossierOrder.customerInfo.fullName}</p>
                      <p className="text-forest/80 mt-1">{dossierOrder.customerInfo.addressLine1}</p>
                      {dossierOrder.customerInfo.addressLine2 && (
                        <p className="text-forest/80">{dossierOrder.customerInfo.addressLine2}</p>
                      )}
                      <p className="text-forest/80">
                        {dossierOrder.customerInfo.city}, {dossierOrder.customerInfo.state} - {dossierOrder.customerInfo.pincode}
                      </p>
                      <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gold/10 text-[9px] text-emerald-700 font-bold uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Indian Pincode Registry Verified</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-500/5 border border-amber-500/25 p-4 text-xs font-sans text-amber-700 italic flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Guest Allocation. No checkout address details captured.</span>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="text-[9px] font-sans font-bold uppercase tracking-widest text-forest/40">Allocated Teas</h4>
                  <div className="divide-y divide-gold/10 bg-ivory-light border border-gold/15 px-4 py-1.5">
                    {(dossierOrder.items || []).map((item, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between text-xs font-sans text-forest/85">
                        <span>{item.name} <span className="text-forest/45 text-[10px] ml-1">× {item.qty}</span></span>
                        <span className="font-bold tracking-wider">₹{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {dossierOrder.note && (
                  <div className="space-y-1 bg-gold/5 border border-gold/15 p-3 text-xs italic text-forest/70">
                    <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-gold-dark block not-italic">Concierge Note</span>
                    "{dossierOrder.note}"
                  </div>
                )}
              </div>

              {/* Footer Total */}
              <div className="mt-8 pt-4 border-t border-gold/15 flex items-center justify-between">
                <div>
                  <span className="text-[8px] uppercase text-forest/50 font-sans tracking-wider block">Estimated Total Secured</span>
                  <span className="text-lg font-bold text-forest tracking-wider font-sans">₹{dossierOrder.total?.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setDossierOrder(null)}
                  className="px-6 py-2 border border-forest text-forest hover:bg-forest hover:text-ivory text-[10px] font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer min-h-[36px]"
                >
                  Close Dossier
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
