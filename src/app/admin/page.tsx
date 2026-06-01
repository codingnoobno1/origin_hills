"use client";

import React, { useState, useEffect } from "react";
import { AdminStats } from "./components/AdminStats";
import { CollectorTable, CollectorRecord } from "./components/CollectorTable";
import { InventoryManager } from "./components/InventoryManager";
import { Button, Input, LuxuryDivider } from "@/components/portfolio/ui-elements";
import { Compass, RefreshCw, Key, ShieldCheck, DatabaseBackup } from "lucide-react";
import { LuxuryToast } from "@/components/portfolio/LuxuryToast";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [collectors, setCollectors] = useState<CollectorRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorGate, setErrorGate] = useState<string | null>(null);

  // Auto-login during development or trace session
  useEffect(() => {
    const session = localStorage.getItem("origin_hills_admin_session");
    if (session === "active") {
      setIsAuthenticated(true);
      fetchLedger();
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("origin_hills_admin_session", "active");
      setToastMessage("Secure admin credentials accepted. Welcome back.");
      fetchLedger();
    } else {
      setErrorGate("Invalid administrative entry credentials.");
    }
  };

  const fetchLedger = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/collectors");
      if (!res.ok) throw new Error("Could not contact registration ledger.");
      const data = await res.json();
      setCollectors(data.collectors || []);
      if (data.isSandbox) {
        setToastMessage("Connected successfully (Sandbox Sandbox Mode Active).");
      }
    } catch (err: any) {
      setToastMessage(`Error retrieving records: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/collectors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Could not update allocation status.");
      
      setToastMessage(`Allocation request updated successfully: ${newStatus}`);
      fetchLedger();
    } catch (err: any) {
      setToastMessage(`Error: ${err.message}`);
    }
  };

  const handleUpdateTins = async (id: string, newTins: number) => {
    try {
      const res = await fetch("/api/admin/collectors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, tins: newTins }),
      });
      if (!res.ok) throw new Error("Could not adjust allocation quantity.");
      
      setToastMessage(`Collector allocation quantity modified to ${newTins} tins.`);
      fetchLedger();
    } catch (err: any) {
      setToastMessage(`Error: ${err.message}`);
    }
  };

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/collectors", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failure.");
      setToastMessage(data.message || "Database seeded successfully!");
      fetchLedger();
    } catch (err: any) {
      setToastMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("origin_hills_admin_session");
    setAdminPassword("");
    setToastMessage("Session credentials cleared. Safe travels.");
  };

  // Compile overview statistics
  const getStats = () => {
    const totalCollectors = collectors.length;
    const activeReservations = collectors.reduce((acc, c) => acc + (c.allocationTins || 1), 0);
    const approvedAllocations = collectors.filter((c) => c.allocationStatus === "Approved").length;
    const pendingAllocations = collectors.filter((c) => c.allocationStatus.toLowerCase().includes("pending")).length;

    return { totalCollectors, activeReservations, approvedAllocations, pendingAllocations };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-forest text-ivory flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract vector backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.06),transparent_65%)]" />
        <div className="absolute inset-y-12 inset-x-12 border border-gold/10 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-forest-dark border border-gold/25 p-8 sm:p-12 shadow-2xl flex flex-col justify-center">
          <div className="text-center mb-8">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold block mb-2">
              ORIGIN HILLS
            </span>
            <h2 className="text-2xl font-serif text-ivory tracking-wide leading-snug">
              Administrative Gate
            </h2>
            <div className="w-12 h-px bg-gold/50 mx-auto my-4" />
            <p className="text-[10px] text-ivory/55 font-sans leading-relaxed tracking-wide max-w-[240px] mx-auto font-light">
              Enter administrative cellar key credentials to review private allocation logs and database ledgers.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
            {errorGate && (
              <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-[11px] font-sans text-center tracking-wide">
                {errorGate}
              </div>
            )}
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-ivory/50 font-semibold font-sans">
                Administrative Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter 'admin' to unlock ledger..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-forest border border-ivory/15 px-4 py-3 text-xs text-ivory placeholder:text-ivory/25 focus:outline-none focus:border-gold transition-all duration-300 font-sans pr-10"
                  required
                />
                <Key className="w-4 h-4 text-ivory/30 absolute right-3 top-3.5" />
              </div>
            </div>

            <Button type="submit" variant="secondary" className="w-full mt-2 font-bold uppercase tracking-wider py-4">
              Unlock Ledger
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-forest pb-24">
      {/* Top Header Section */}
      <header className="bg-forest text-ivory py-6 px-6 md:px-12 border-b border-gold/15 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-gold" />
            <div>
              <h1 className="text-sm font-serif tracking-[0.2em] text-ivory uppercase">
                ORIGIN HILLS
              </h1>
              <span className="text-[9px] font-sans text-gold uppercase tracking-[0.25em] font-semibold mt-0.5 block">
                Collector Cellar Management console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-[9px] font-sans font-bold uppercase tracking-widest text-gold hover:text-gold-light transition-colors duration-300 cursor-pointer"
            >
              Lock Console
            </button>
            <span className="h-4 w-px bg-ivory/20" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span className="text-[9px] font-sans text-ivory/80 uppercase tracking-widest font-semibold">
                Console Secured
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-10 flex flex-col gap-8">
        
        {/* Dynamic Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/15 pb-6">
          <div>
            <h2 className="text-3xl font-serif text-forest tracking-wide font-light">
              Estate Ledger Logs
            </h2>
            <p className="text-[10px] text-forest/50 font-sans tracking-wide mt-0.5 uppercase">
              Operational interface connected to MongoAtlas clusters
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Database seed button */}
            <Button
              onClick={handleSeedDatabase}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="flex items-center gap-1.5 border-forest/20 text-forest/75 bg-transparent hover:bg-forest/5 hover:border-forest"
            >
              <DatabaseBackup className="w-3.5 h-3.5 text-gold" />
              Seed Mock Ledgers
            </Button>
            
            <Button
              onClick={fetchLedger}
              variant="primary"
              size="sm"
              disabled={isLoading}
              className="flex items-center gap-1.5 font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-ivory ${isLoading ? "animate-spin" : ""}`} />
              Refresh Database
            </Button>
          </div>
        </div>

        {/* Overview Stats Sub-Panel */}
        <AdminStats stats={getStats()} />

        {/* Major Workspaces Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Table (2 cols span) */}
          <div className="lg:col-span-2">
            <CollectorTable
              collectors={collectors}
              onUpdateStatus={handleUpdateStatus}
              onUpdateTins={handleUpdateTins}
            />
          </div>

          {/* Right Capacity Manager (1 col span) */}
          <div className="lg:col-span-1">
            <InventoryManager collectors={collectors} />
          </div>
        </div>

      </main>

      <LuxuryToast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
