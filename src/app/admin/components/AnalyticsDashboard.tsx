"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Users, Mail, Package, AlertCircle } from "lucide-react";

interface AnalyticsData {
  totalCollectors: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  newsletterSubscribers: number;
  totalProducts: number;
  topProducts: { name: string; orders: number }[];
  recentOrders?: any[];
}

interface AnalyticsDashboardProps { onToast: (msg: string) => void; }

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onToast }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => setData(d.analytics))
      .catch(() => onToast("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-forest/40 font-sans text-xs animate-pulse">Loading analytics…</div>;
  if (!data) return null;

  const stats = [
    { label: "Total Revenue", value: `$${data.totalRevenue?.toFixed(2) || "0.00"}`, icon: <TrendingUp className="w-5 h-5 text-gold" />, sub: "All time" },
    { label: "Total Orders", value: data.totalOrders, icon: <ShoppingBag className="w-5 h-5 text-gold" />, sub: `${data.pendingOrders} pending` },
    { label: "Collectors", value: data.totalCollectors, icon: <Users className="w-5 h-5 text-gold" />, sub: "Registered users" },
    { label: "Products", value: data.totalProducts, icon: <Package className="w-5 h-5 text-gold" />, sub: "Active catalogue" },
    { label: "Newsletter", value: data.newsletterSubscribers, icon: <Mail className="w-5 h-5 text-gold" />, sub: "Subscribers" },
    { label: "Pending", value: data.pendingOrders, icon: <AlertCircle className="w-5 h-5 text-amber-500" />, sub: "Needs review", alert: data.pendingOrders > 0 },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-serif text-forest tracking-wide">Analytics Overview</h3>
        <p className="text-[10px] text-forest/40 font-sans tracking-widest uppercase mt-0.5">Live data from MongoDB Atlas</p>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`bg-ivory border p-5 flex flex-col gap-2 relative overflow-hidden ${s.alert ? "border-amber-500/30" : "border-gold/15"}`}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold/30" />
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-forest/50">{s.label}</span>
              <div className="p-1.5 bg-forest/5 border border-gold/10">{s.icon}</div>
            </div>
            <span className="text-2xl font-sans font-light text-forest tracking-tight">{s.value}</span>
            <span className="text-[9px] font-sans text-forest/40 tracking-wide">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Top Products */}
      {data.topProducts?.length > 0 && (
        <div className="bg-ivory border border-gold/15 p-6">
          <h4 className="text-sm font-serif text-forest mb-4 font-medium">Top Products by Orders</h4>
          <div className="flex flex-col gap-3">
            {data.topProducts.map((p, i) => {
              const max = data.topProducts[0]?.orders || 1;
              const pct = Math.round((p.orders / max) * 100);
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-forest font-semibold">{p.name}</span>
                    <span className="text-forest/60 font-bold">{p.orders} orders</span>
                  </div>
                  <div className="h-1.5 bg-forest/5 border border-gold/5">
                    <div className="h-full bg-gold transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {(data.recentOrders?.length ?? 0) > 0 && (
        <div className="bg-ivory border border-gold/15 p-6">
          <h4 className="text-sm font-serif text-forest mb-4 font-medium">Recent Orders</h4>
          <div className="flex flex-col divide-y divide-gold/5">
            {(data.recentOrders ?? []).slice(0, 5).map((o: any, i: number) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs font-sans">
                <span className="text-forest/70">{o.userEmail}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-forest">${o.total?.toFixed(2)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    o.status === "Confirmed" ? "bg-green-500/10 text-green-700 border-green-500/25" :
                    "bg-amber-500/10 text-amber-700 border-amber-500/25"
                  }`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
