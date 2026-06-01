"use client";
import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/portfolio/ui-elements";

interface ContentEditorProps {
  onToast: (msg: string) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ onToast }) => {
  const [hero, setHero] = useState<any>({});
  const [about, setAbout] = useState<any>({});
  const [savingHero, setSavingHero] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/content/hero").then((r) => r.json()),
      fetch("/api/content/about").then((r) => r.json()),
    ]).then(([h, a]) => {
      setHero(h.hero || {});
      setAbout(a.about || {});
    }).catch(() => onToast("Failed to load content"))
      .finally(() => setLoading(false));
  }, []);

  const saveHero = async () => {
    setSavingHero(true);
    try {
      const res = await fetch("/api/content/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      });
      if (!res.ok) throw new Error("Save failed");
      onToast("Hero content saved ✓");
    } catch (e: any) {
      onToast(`Error: ${e.message}`);
    } finally {
      setSavingHero(false);
    }
  };

  const saveAbout = async () => {
    setSavingAbout(true);
    try {
      const res = await fetch("/api/content/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      if (!res.ok) throw new Error("Save failed");
      onToast("About content saved ✓");
    } catch (e: any) {
      onToast(`Error: ${e.message}`);
    } finally {
      setSavingAbout(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-forest/40 font-sans text-xs animate-pulse">Loading content…</div>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-serif text-forest tracking-wide">Content Management</h3>
        <p className="text-[10px] text-forest/40 font-sans tracking-widest uppercase mt-0.5">Edit hero and about content stored in MongoDB</p>
      </div>

      {/* Hero Section */}
      <div className="bg-ivory border border-gold/15 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-gold/10 pb-4">
          <div>
            <h4 className="text-sm font-serif text-forest font-medium">Hero Section</h4>
            <p className="text-[10px] text-forest/40 font-sans tracking-wide mt-0.5">Controls the landing page headline and CTAs</p>
          </div>
          <Button onClick={saveHero} variant="secondary" size="sm" disabled={savingHero} className="flex items-center gap-1.5 font-bold">
            {savingHero ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save Hero
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CField label="Main Headline">
            <input value={hero.headline || ""} onChange={(e) => setHero((h: any) => ({ ...h, headline: e.target.value }))} className={ic} placeholder="Where soil, mist, and time steer perfection." />
          </CField>
          <CField label="Badge Text">
            <input value={hero.badge || ""} onChange={(e) => setHero((h: any) => ({ ...h, badge: e.target.value }))} className={ic} placeholder="ESTATE RESERVE SELECTION" />
          </CField>
          <CField label="Primary CTA Button">
            <input value={hero.ctaPrimary || ""} onChange={(e) => setHero((h: any) => ({ ...h, ctaPrimary: e.target.value }))} className={ic} placeholder="Explore Reserve" />
          </CField>
          <CField label="Secondary CTA Button">
            <input value={hero.ctaSecondary || ""} onChange={(e) => setHero((h: any) => ({ ...h, ctaSecondary: e.target.value }))} className={ic} placeholder="Request Allocation" />
          </CField>
          <CField label="Coordinates Display">
            <input value={hero.coordinates || ""} onChange={(e) => setHero((h: any) => ({ ...h, coordinates: e.target.value }))} className={ic} placeholder="KANCHENJUNGA 27.7025° N" />
          </CField>
          <CField label="Est. Year">
            <input value={hero.established || ""} onChange={(e) => setHero((h: any) => ({ ...h, established: e.target.value }))} className={ic} placeholder="EST. 2026" />
          </CField>
          <div className="sm:col-span-2">
            <CField label="Subheadline">
              <textarea value={hero.subheadline || ""} onChange={(e) => setHero((h: any) => ({ ...h, subheadline: e.target.value }))} rows={2} className={`${ic} resize-none`} placeholder="An exquisite registry of limited micro-batch tea allocations…" />
            </CField>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-ivory border border-gold/15 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-gold/10 pb-4">
          <div>
            <h4 className="text-sm font-serif text-forest font-medium">Brand & About Content</h4>
            <p className="text-[10px] text-forest/40 font-sans tracking-wide mt-0.5">Manifesto quote and heritage sections</p>
          </div>
          <Button onClick={saveAbout} variant="secondary" size="sm" disabled={savingAbout} className="flex items-center gap-1.5 font-bold">
            {savingAbout ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save About
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <CField label="Manifesto Quote">
            <textarea value={about.manifesto || ""} onChange={(e) => setAbout((a: any) => ({ ...a, manifesto: e.target.value }))} rows={2} className={`${ic} resize-none`} placeholder="Time is the ultimate luxury…" />
          </CField>
          <CField label="Brand Story Body">
            <textarea value={about.body || ""} onChange={(e) => setAbout((a: any) => ({ ...a, body: e.target.value }))} rows={3} className={`${ic} resize-none`} placeholder="At Origin Hills…" />
          </CField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CField label="Section 1 Title">
              <input value={about.section1Title || ""} onChange={(e) => setAbout((a: any) => ({ ...a, section1Title: e.target.value }))} className={ic} placeholder="Quiet Luxury, harvested by hand." />
            </CField>
            <CField label="Section 2 Title">
              <input value={about.section2Title || ""} onChange={(e) => setAbout((a: any) => ({ ...a, section2Title: e.target.value }))} className={ic} placeholder="Oxidation & slow drying art." />
            </CField>
            <CField label="Section 1 Body">
              <textarea value={about.section1Body || ""} onChange={(e) => setAbout((a: any) => ({ ...a, section1Body: e.target.value }))} rows={2} className={`${ic} resize-none`} />
            </CField>
            <CField label="Section 2 Body">
              <textarea value={about.section2Body || ""} onChange={(e) => setAbout((a: any) => ({ ...a, section2Body: e.target.value }))} rows={2} className={`${ic} resize-none`} />
            </CField>
          </div>
        </div>
      </div>
    </div>
  );
};

const ic = "w-full bg-forest/5 border border-forest/15 px-3 py-2.5 text-xs text-forest placeholder:text-forest/30 focus:outline-none focus:border-gold transition-all font-sans";
const CField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-forest/50">{label}</label>
    {children}
  </div>
);
