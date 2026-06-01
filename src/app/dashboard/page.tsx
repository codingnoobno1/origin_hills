"use client";

import React, { useState, useEffect } from "react";
import { SteepingStats } from "./components/SteepingStats";
import { CellarReserve } from "./components/CellarReserve";
import { AllocationHistory } from "./components/AllocationHistory";
import { Button, LuxuryDivider } from "@/components/portfolio/ui-elements";
import { Compass, Sparkles, LogOut, ArrowLeft, Loader2, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { LuxuryToast } from "@/components/portfolio/LuxuryToast";

interface UserProfile {
  name: string;
  email: string;
  preference: string;
  createdAt: string;
  allocationStatus: string;
  allocationTins: number;
  steepingStats: {
    hoursSteeped: number;
    averageTemp: string;
    favoriteVarietal: string;
    tastingScore: number;
  };
  cellarReserves: any[];
  allocationHistory: any[];
}

export default function UserDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("origin_hills_user");
    if (!savedUser) {
      setIsLoading(false);
      return;
    }
    setUserEmail(savedUser);
    fetchUserProfile(savedUser);
  }, []);

  const fetchUserProfile = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/allocations?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error("Could not contact allocations ledger.");
      }
      const data = await res.json();
      setProfile(data.collector);
      if (data.isSandbox) {
        setToastMessage("Connected successfully (Sandbox Sandbox Mode Active).");
      }
    } catch (err: any) {
      setToastMessage(`Error retrieving profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("origin_hills_user");
    setToastMessage("Secure session closed.");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const handleReturnHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <span className="text-xs font-sans text-forest/50 uppercase tracking-widest">
            Accessing private vault...
          </span>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-forest text-ivory flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.06),transparent_65%)]" />
        <div className="absolute inset-y-12 inset-x-12 border border-gold/10 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-forest-dark border border-gold/25 p-8 sm:p-12 shadow-2xl text-center">
          <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center bg-forest/5 mb-4 mx-auto">
            <span className="text-gold">✦</span>
          </div>
          
          <h2 className="text-2xl font-serif text-ivory tracking-wide">
            Vault Entry Denied
          </h2>
          <div className="w-12 h-px bg-gold/50 mx-auto my-4" />
          
          <p className="text-xs text-ivory/55 font-sans leading-relaxed tracking-wide mb-8 font-light">
            You must be logged in as an active collector in the Origin Hills Connoisseur Registry to inspect private cellar allocations and steeping logs.
          </p>

          <Button
            onClick={handleReturnHome}
            variant="secondary"
            className="w-full font-bold uppercase tracking-wider py-4"
          >
            Return to Sourcing Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-forest pb-24 animate-fade-in">
      {/* Top Header */}
      <header className="bg-forest text-ivory py-6 px-6 md:px-12 border-b border-gold/15 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-gold" />
            <div>
              <span className="text-[9px] font-sans text-gold uppercase tracking-[0.25em] font-semibold block">
                CONNOISSEUR PORTAL
              </span>
              <h1 className="text-sm font-serif tracking-[0.2em] text-ivory uppercase mt-0.5">
                ORIGIN HILLS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleReturnHome}
              className="flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-widest text-gold hover:text-gold-light transition-colors duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Sourcing Catalog
            </button>
            <span className="h-4 w-px bg-ivory/20" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-widest text-ivory/70 hover:text-red-400 transition-colors duration-300 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Clear Session
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-10 flex flex-col gap-8">
        
        {/* Profile Welcome Bar */}
        {profile && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gold/15 pb-6 animate-fade-in">
            <div className="flex flex-col">
              <span className="text-[9px] font-sans font-bold text-gold-dark uppercase tracking-widest mb-1.5">
                Collector Allocation ID: #{profile.preference.toUpperCase()}-{profile.createdAt.substring(14,19)}
              </span>
              <h2 className="text-3xl font-serif text-forest tracking-wide font-light">
                Welcome back, {profile.name}
              </h2>
            </div>
            
            <div className="flex items-center gap-3 self-start md:self-auto bg-forest text-ivory p-4 border border-gold/25 relative overflow-hidden">
              {/* Gold line accent */}
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gold" />
              <Award className="w-5 h-5 text-gold flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[8px] font-sans tracking-[0.2em] uppercase text-ivory/45">
                  Private Cellar Status
                </span>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-gold">
                  {profile.allocationStatus}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Steeping Sommelier Stats */}
        {profile && <SteepingStats stats={profile.steepingStats} />}

        {/* Vault Grid */}
        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Reserves (2 cols span) */}
            <div className="lg:col-span-2">
              <CellarReserve reserves={profile.cellarReserves} />
            </div>

            {/* Timeline (1 col span) */}
            <div className="lg:col-span-1">
              <AllocationHistory history={profile.allocationHistory} />
            </div>
          </div>
        )}

      </main>

      <LuxuryToast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
