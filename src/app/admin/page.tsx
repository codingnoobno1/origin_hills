"use client";

import React, { useState, useEffect } from "react";
import { AdminStats } from "./components/AdminStats";
import { CollectorTable, CollectorRecord } from "./components/CollectorTable";
import { InventoryManager } from "./components/InventoryManager";
import { ProductManager } from "./components/ProductManager";
import { OrderManager } from "./components/OrderManager";
import { ContentEditor } from "./components/ContentEditor";
import { NewsletterManager } from "./components/NewsletterManager";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { Button } from "@/components/portfolio/ui-elements";
import { LuxuryToast } from "@/components/portfolio/LuxuryToast";
import {
  Compass, Key, ShieldCheck, LayoutDashboard,
  Package, ShoppingBag, Users, FileText, Mail,
  BarChart3, RefreshCw, LogOut,
} from "lucide-react";

type Tab = "overview" | "products" | "orders" | "collectors" | "content" | "newsletter" | "analytics";

const TABS: { id: Tab; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: "overview",    label: "Overview",    shortLabel: "Home",       icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "products",   label: "Products",    shortLabel: "Products",   icon: <Package className="w-5 h-5" /> },
  { id: "orders",     label: "Orders",      shortLabel: "Orders",     icon: <ShoppingBag className="w-5 h-5" /> },
  { id: "collectors", label: "Collectors",  shortLabel: "Members",    icon: <Users className="w-5 h-5" /> },
  { id: "content",    label: "Content CMS", shortLabel: "Content",    icon: <FileText className="w-5 h-5" /> },
  { id: "newsletter", label: "Newsletter",  shortLabel: "Mail",       icon: <Mail className="w-5 h-5" /> },
  { id: "analytics",  label: "Analytics",   shortLabel: "Analytics",  icon: <BarChart3 className="w-5 h-5" /> },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [collectors, setCollectors] = useState<CollectorRecord[]>([]);
  const [loadingCollectors, setLoadingCollectors] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorGate, setErrorGate] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("origin_hills_admin_session");
    if (session === "active") { setIsAuthenticated(true); fetchCollectors(); }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("origin_hills_admin_session", "active");
      setToastMessage("Admin console unlocked.");
      fetchCollectors();
    } else {
      setErrorGate("Invalid credentials. Try again.");
    }
  };

  const fetchCollectors = async () => {
    setLoadingCollectors(true);
    try {
      const res = await fetch("/api/admin/collectors");
      const data = await res.json();
      setCollectors(data.collectors || []);
    } catch { setToastMessage("Failed to load collector ledger"); }
    finally { setLoadingCollectors(false); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/collectors", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      setToastMessage(`Status → ${status}`);
      fetchCollectors();
    } catch { setToastMessage("Failed to update"); }
  };

  const handleUpdateTins = async (id: string, tins: number) => {
    try {
      await fetch("/api/admin/collectors", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, tins }) });
      setToastMessage(`Allocation → ${tins} tins`);
      fetchCollectors();
    } catch { setToastMessage("Failed to update"); }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("origin_hills_admin_session");
    setAdminPassword("");
  };

  const getStats = () => ({
    totalCollectors: collectors.length,
    activeReservations: collectors.reduce((acc, c) => acc + (c.allocationTins || 1), 0),
    approvedAllocations: collectors.filter((c) => c.allocationStatus === "Approved").length,
    pendingAllocations: collectors.filter((c) => c.allocationStatus.toLowerCase().includes("pending")).length,
  });

  const activeTabData = TABS.find((t) => t.id === activeTab)!;

  // ── Login Gate ────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.07),transparent_65%)]" />
        <div className="relative z-10 w-full max-w-xs bg-forest-dark border border-gold/25 p-7 shadow-2xl">
          <div className="text-center mb-7">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-gold block mb-3">ORIGIN HILLS</span>
            <h2 className="text-xl font-serif text-ivory tracking-wide">Admin Console</h2>
            <div className="w-8 h-px bg-gold/40 mx-auto my-3" />
            <p className="text-[10px] text-ivory/45 font-sans leading-relaxed">Enter your credentials to continue.</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
            {errorGate && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-sans text-center rounded">{errorGate}</div>
            )}
            <div className="relative">
              <input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(e) => { setAdminPassword(e.target.value); setErrorGate(null); }}
                className="w-full bg-forest border border-ivory/15 px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/25 focus:outline-none focus:border-gold transition-all font-sans pr-10 min-h-[48px]"
                required
              />
              <Key className="w-4 h-4 text-ivory/30 absolute right-3.5 top-4" />
            </div>
            <button type="submit" className="w-full bg-gold text-forest font-sans font-bold uppercase tracking-widest text-xs py-3.5 min-h-[48px] hover:bg-gold/90 transition-all active:scale-[0.98]">
              Unlock Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main Console ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f3ee] text-forest flex flex-col">

      {/* ── Top Header ── */}
      <header className="bg-forest text-ivory sticky top-0 z-30 border-b border-gold/20 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-gold flex-shrink-0" />
            <div className="leading-tight">
              <span className="text-[11px] font-serif tracking-[0.2em] text-ivory uppercase block">ORIGIN HILLS</span>
              {/* Show current tab name on mobile */}
              <span className="text-[9px] font-sans text-gold uppercase tracking-widest sm:hidden">{activeTabData.label}</span>
              <span className="text-[9px] font-sans text-ivory/50 uppercase tracking-widest hidden sm:block">Admin Console</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span className="text-[9px] font-sans text-ivory/60 uppercase tracking-widest">Secured</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-gold hover:text-ivory transition-colors cursor-pointer min-h-[36px] px-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>

        {/* Desktop tab bar (inside header, below brand row) */}
        <div className="hidden sm:flex border-t border-gold/10 px-4 max-w-screen-xl mx-auto overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-sans font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "border-gold text-gold"
                  : "border-transparent text-ivory/50 hover:text-ivory/80"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-8 max-w-screen-xl mx-auto w-full pb-24 sm:pb-8 overflow-x-hidden">

        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-forest font-light">Ledger Overview</h2>
                <p className="text-[10px] text-forest/40 font-sans uppercase tracking-widest mt-0.5">Collector allocations & capacity</p>
              </div>
              <button
                onClick={fetchCollectors}
                disabled={loadingCollectors}
                className="flex items-center gap-1.5 px-3 py-2 border border-forest/20 text-forest/70 text-[10px] font-sans font-bold uppercase tracking-wider hover:bg-forest/5 transition-all min-h-[40px] cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingCollectors ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
            <AdminStats stats={getStats()} />
            <CollectorTable collectors={collectors} onUpdateStatus={handleUpdateStatus} onUpdateTins={handleUpdateTins} />
            <InventoryManager collectors={collectors} />
          </div>
        )}

        {activeTab === "products"   && <ProductManager   onToast={(m) => setToastMessage(m)} />}
        {activeTab === "orders"     && <OrderManager     onToast={(m) => setToastMessage(m)} />}
        {activeTab === "content"    && <ContentEditor    onToast={(m) => setToastMessage(m)} />}
        {activeTab === "newsletter" && <NewsletterManager onToast={(m) => setToastMessage(m)} />}
        {activeTab === "analytics"  && <AnalyticsDashboard onToast={(m) => setToastMessage(m)} />}

        {activeTab === "collectors" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-forest font-light">Collector Registry</h2>
                <p className="text-[10px] text-forest/40 font-sans uppercase tracking-widest mt-0.5">Registered members & allocations</p>
              </div>
              <button
                onClick={fetchCollectors}
                disabled={loadingCollectors}
                className="flex items-center gap-1.5 px-3 py-2 border border-forest/20 text-forest/70 text-[10px] font-sans font-bold uppercase tracking-wider hover:bg-forest/5 transition-all min-h-[40px] cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingCollectors ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
            <CollectorTable collectors={collectors} onUpdateStatus={handleUpdateStatus} onUpdateTins={handleUpdateTins} />
          </div>
        )}
      </main>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest border-t border-gold/20 grid grid-cols-7">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-2.5 gap-0.5 cursor-pointer transition-all duration-200 ${
              activeTab === tab.id
                ? "text-gold"
                : "text-ivory/40 active:text-ivory/70"
            }`}
          >
            {tab.icon}
            <span className="text-[8px] font-sans font-semibold uppercase tracking-wide leading-none">{tab.shortLabel}</span>
          </button>
        ))}
      </nav>

      <LuxuryToast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
