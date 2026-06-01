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
  Package, ShoppingBag, Users, FileText, Mail, BarChart3, RefreshCw,
} from "lucide-react";

type Tab = "overview" | "products" | "orders" | "collectors" | "content" | "newsletter" | "analytics";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview",    label: "Overview",    icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "products",   label: "Products",    icon: <Package className="w-4 h-4" /> },
  { id: "orders",     label: "Orders",      icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "collectors", label: "Collectors",  icon: <Users className="w-4 h-4" /> },
  { id: "content",    label: "Content",     icon: <FileText className="w-4 h-4" /> },
  { id: "newsletter", label: "Newsletter",  icon: <Mail className="w-4 h-4" /> },
  { id: "analytics",  label: "Analytics",   icon: <BarChart3 className="w-4 h-4" /> },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [collectors, setCollectors] = useState<CollectorRecord[]>([]);
  const [loadingCollectors, setLoadingCollectors] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorGate, setErrorGate] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("origin_hills_admin_session");
    if (session === "active") { setIsAuthenticated(true); fetchCollectors(); }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("origin_hills_admin_session", "active");
      setToastMessage("Admin console unlocked. Welcome.");
      fetchCollectors();
    } else {
      setErrorGate("Invalid administrative credentials.");
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
      setToastMessage(`Status updated → ${status}`);
      fetchCollectors();
    } catch { setToastMessage("Failed to update status"); }
  };

  const handleUpdateTins = async (id: string, tins: number) => {
    try {
      await fetch("/api/admin/collectors", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, tins }) });
      setToastMessage(`Allocation updated → ${tins} tins`);
      fetchCollectors();
    } catch { setToastMessage("Failed to update tins"); }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("origin_hills_admin_session");
    setAdminPassword("");
    setToastMessage("Session cleared.");
  };

  const getStats = () => ({
    totalCollectors: collectors.length,
    activeReservations: collectors.reduce((acc, c) => acc + (c.allocationTins || 1), 0),
    approvedAllocations: collectors.filter((c) => c.allocationStatus === "Approved").length,
    pendingAllocations: collectors.filter((c) => c.allocationStatus.toLowerCase().includes("pending")).length,
  });

  // ── Login gate ──────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-forest text-ivory flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.06),transparent_65%)]" />
        <div className="absolute inset-y-12 inset-x-12 border border-gold/10 pointer-events-none hidden sm:block" />
        <div className="relative z-10 w-full max-w-sm bg-forest-dark border border-gold/25 p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-gold block mb-2">ORIGIN HILLS</span>
            <h2 className="text-2xl font-serif text-ivory tracking-wide">Admin Console</h2>
            <div className="w-10 h-px bg-gold/40 mx-auto my-4" />
            <p className="text-[10px] text-ivory/50 font-sans leading-relaxed">Enter admin credentials to access the management console.</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            {errorGate && (
              <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-[11px] font-sans text-center">{errorGate}</div>
            )}
            <div className="relative">
              <input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-forest border border-ivory/15 px-4 py-3 text-xs text-ivory placeholder:text-ivory/25 focus:outline-none focus:border-gold transition-all font-sans pr-10"
                required
              />
              <Key className="w-4 h-4 text-ivory/30 absolute right-3 top-3.5" />
            </div>
            <Button type="submit" variant="secondary" className="w-full font-bold uppercase py-3.5">Unlock Console</Button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main Console ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-forest flex flex-col">

      {/* Top Header */}
      <header className="bg-forest text-ivory py-4 px-4 sm:px-8 border-b border-gold/15 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-gold flex-shrink-0" />
            <div>
              <h1 className="text-sm font-serif tracking-[0.18em] text-ivory uppercase leading-none">ORIGIN HILLS</h1>
              <span className="text-[9px] font-sans text-gold uppercase tracking-widest">Admin Console</span>
            </div>
          </div>

          {/* Mobile tab toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="sm:hidden text-ivory/60 hover:text-ivory transition-colors text-[10px] font-sans uppercase tracking-widest font-bold"
          >
            Menu
          </button>

          <div className="hidden sm:flex items-center gap-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span className="text-[9px] font-sans text-ivory/70 uppercase tracking-widest">Secured</span>
            </div>
            <button onClick={handleLogout} className="text-[9px] font-sans font-bold uppercase tracking-widest text-gold hover:text-ivory transition-colors cursor-pointer">
              Lock Console
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">

        {/* Sidebar Nav */}
        <aside className={`${mobileNavOpen ? "block" : "hidden"} sm:block w-full sm:w-52 flex-shrink-0 border-r border-gold/15 bg-ivory min-h-[calc(100vh-57px)] sticky top-[57px] self-start`}>
          <nav className="flex flex-col p-3 gap-1 pt-5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileNavOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 text-left text-[11px] font-sans font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-none border-l-2 ${
                  activeTab === tab.id
                    ? "bg-forest text-ivory border-gold"
                    : "text-forest/60 hover:text-forest hover:bg-forest/5 border-transparent"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}

            <div className="mt-4 pt-4 border-t border-gold/15 sm:hidden">
              <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-red-600 cursor-pointer">
                Lock Console
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-5 sm:p-8 overflow-x-hidden">

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-serif text-forest font-light tracking-wide">Estate Ledger Overview</h2>
                  <p className="text-[10px] text-forest/40 font-sans tracking-widest uppercase mt-1">Collector allocations and capacity summary</p>
                </div>
                <Button onClick={fetchCollectors} variant="primary" size="sm" disabled={loadingCollectors} className="flex items-center gap-1.5">
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingCollectors ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <AdminStats stats={getStats()} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CollectorTable collectors={collectors} onUpdateStatus={handleUpdateStatus} onUpdateTins={handleUpdateTins} />
                </div>
                <div className="lg:col-span-1">
                  <InventoryManager collectors={collectors} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && <ProductManager onToast={(m) => setToastMessage(m)} />}
          {activeTab === "orders" && <OrderManager onToast={(m) => setToastMessage(m)} />}
          {activeTab === "content" && <ContentEditor onToast={(m) => setToastMessage(m)} />}
          {activeTab === "newsletter" && <NewsletterManager onToast={(m) => setToastMessage(m)} />}
          {activeTab === "analytics" && <AnalyticsDashboard onToast={(m) => setToastMessage(m)} />}

          {/* Collectors Tab */}
          {activeTab === "collectors" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-serif text-forest font-light">Collector Registry</h2>
                  <p className="text-[10px] text-forest/40 font-sans tracking-widest uppercase mt-1">Registered members and allocation ledger</p>
                </div>
                <Button onClick={fetchCollectors} variant="primary" size="sm" disabled={loadingCollectors} className="flex items-center gap-1.5">
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingCollectors ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <CollectorTable collectors={collectors} onUpdateStatus={handleUpdateStatus} onUpdateTins={handleUpdateTins} />
            </div>
          )}
        </main>
      </div>

      <LuxuryToast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
