"use client";
import React, { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X, Save, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/portfolio/ui-elements";

export interface ProductRecord {
  _id: string;
  name: string;
  category: string;
  tag: string;
  origin: string;
  elevation: string;
  price: number;
  description: string;
  image: string;
  steepTemp: string;
  steepTime: string;
  tastingNotes: string[];
  profiles: { aromatic: number; mineral: number; floral: number; roasted: number; umami: number };
  stock: number;
  active: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  name: "", category: "Assam Heritage", tag: "", origin: "", elevation: "",
  price: "", description: "", image: "", steepTemp: "", steepTime: "",
  tastingNotesRaw: "", stock: "0",
  aromatic: "5", mineral: "5", floral: "5", roasted: "5", umami: "5",
};

const CATEGORIES = ["Assam Heritage", "Floral Reserve", "Mountain Reserve", "Imperial Grade", "Collector Reserve", "White", "Green", "Black", "Oolong"];

interface ProductManagerProps {
  onToast: (msg: string) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ onToast }) => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    if (loaded && !loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products || []);
      setLoaded(true);
    } catch {
      onToast("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setPreviewImg("");
    setShowForm(true);
  };

  const openEdit = (p: ProductRecord) => {
    setEditingId(p._id);
    setForm({
      name: p.name, category: p.category, tag: p.tag || "",
      origin: p.origin || "", elevation: p.elevation || "",
      price: String(p.price), description: p.description || "",
      image: p.image || "", steepTemp: p.steepTemp || "",
      steepTime: p.steepTime || "",
      tastingNotesRaw: (p.tastingNotes || []).join(", "),
      stock: String(p.stock || 0),
      aromatic: String(p.profiles?.aromatic ?? 5),
      mineral: String(p.profiles?.mineral ?? 5),
      floral: String(p.profiles?.floral ?? 5),
      roasted: String(p.profiles?.roasted ?? 5),
      umami: String(p.profiles?.umami ?? 5),
    });
    setPreviewImg(p.image || "");
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((f) => ({ ...f, image: data.url }));
      setPreviewImg(data.url);
      onToast("Image uploaded and stored in MongoDB ✓");
    } catch (err: any) {
      onToast(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { onToast("Name and price are required"); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        tag: form.tag,
        origin: form.origin,
        elevation: form.elevation,
        price: Number(form.price),
        description: form.description,
        image: form.image,
        steepTemp: form.steepTemp,
        steepTime: form.steepTime,
        tastingNotes: form.tastingNotesRaw.split(",").map((s) => s.trim()).filter(Boolean),
        profiles: {
          aromatic: Number(form.aromatic),
          mineral: Number(form.mineral),
          floral: Number(form.floral),
          roasted: Number(form.roasted),
          umami: Number(form.umami),
        },
        stock: Number(form.stock),
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/admin/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      onToast(editingId ? "Product updated ✓" : "Product created ✓");
      setShowForm(false);
      setLoaded(false);
      fetchProducts();
    } catch (err: any) {
      onToast(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onToast(`"${name}" deleted`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      onToast(`Error: ${err.message}`);
    }
  };

  const handleToggle = async (p: ProductRecord) => {
    try {
      const res = await fetch(`/api/admin/products/${p._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      onToast(`"${p.name}" ${!p.active ? "activated" : "deactivated"}`);
      setProducts((prev) => prev.map((x) => x._id === p._id ? { ...x, active: !x.active } : x));
    } catch (err: any) {
      onToast(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-serif text-forest tracking-wide">Product Catalogue</h3>
          <p className="text-[10px] text-forest/40 font-sans tracking-widest uppercase mt-0.5">
            {products.length} products • Images stored in MongoDB
          </p>
        </div>
        <Button onClick={openCreate} variant="secondary" size="sm" className="flex items-center gap-2 font-bold">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </Button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-forest/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-ivory border border-gold/30 shadow-2xl">
            {/* Form Header */}
            <div className="flex items-center justify-between p-6 border-b border-gold/15 bg-forest text-ivory">
              <h4 className="font-serif text-lg tracking-wide">{editingId ? "Edit Product" : "Add New Product"}</h4>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-ivory/50 hover:text-ivory cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-forest/60">
                  Product Image (stored in MongoDB)
                </label>
                <div className="flex gap-3 items-start flex-wrap">
                  {/* Preview */}
                  <div className="w-28 h-28 bg-forest/5 border border-gold/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {previewImg ? (
                      <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-forest/20" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                      id="img-upload"
                    />
                    <label
                      htmlFor="img-upload"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 border text-[11px] font-sans font-semibold uppercase tracking-wider cursor-pointer transition-all duration-300 ${
                        uploading
                          ? "border-gold/30 text-gold/50 bg-gold/5"
                          : "border-forest/20 text-forest hover:border-forest hover:bg-forest/5"
                      }`}
                    >
                      {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      {uploading ? "Uploading to MongoDB…" : "Upload Image"}
                    </label>
                    <p className="text-[10px] text-forest/40 font-sans">Max 4 MB · JPEG / PNG / WebP</p>
                    <span className="text-[9px] text-forest/30 font-sans">— or paste URL below —</span>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.image}
                      onChange={(e) => { setForm((f) => ({ ...f, image: e.target.value })); setPreviewImg(e.target.value); }}
                      className="w-full border border-forest/15 bg-ivory-light px-3 py-2 text-xs text-forest focus:outline-none focus:border-gold font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Row 1: Name + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Product Name *" required>
                  <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Silver Needle Imperial" />
                </Field>
                <Field label="Category *">
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              {/* Row 2: Tag + Price + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Tag / Badge">
                  <input value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} className={inputCls} placeholder="Rare Reserve" />
                </Field>
                <Field label="Price (USD) *" required>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputCls} placeholder="48.00" />
                </Field>
                <Field label="Stock (tins)">
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className={inputCls} placeholder="100" />
                </Field>
              </div>

              {/* Row 3: Origin + Elevation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Origin">
                  <input value={form.origin} onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))} className={inputCls} placeholder="Ilam Valley, Nepal" />
                </Field>
                <Field label="Elevation">
                  <input value={form.elevation} onChange={(e) => setForm((f) => ({ ...f, elevation: e.target.value }))} className={inputCls} placeholder="2,200m Altitude" />
                </Field>
              </div>

              {/* Row 4: SteepTemp + SteepTime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Steep Temp">
                  <input value={form.steepTemp} onChange={(e) => setForm((f) => ({ ...f, steepTemp: e.target.value }))} className={inputCls} placeholder="80°C" />
                </Field>
                <Field label="Steep Time">
                  <input value={form.steepTime} onChange={(e) => setForm((f) => ({ ...f, steepTime: e.target.value }))} className={inputCls} placeholder="4 min" />
                </Field>
              </div>

              {/* Description */}
              <Field label="Description">
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Tasting notes and estate story…" />
              </Field>

              {/* Tasting Notes */}
              <Field label="Tasting Notes (comma separated)">
                <input value={form.tastingNotesRaw} onChange={(e) => setForm((f) => ({ ...f, tastingNotesRaw: e.target.value }))} className={inputCls} placeholder="Clover Honey, Cucumber, Meadows" />
              </Field>

              {/* Flavor Profiles */}
              <div className="flex flex-col gap-2.5 p-4 bg-forest/5 border border-gold/10">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-forest/60">Flavor Profiles (1–10)</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(["aromatic","mineral","floral","roasted","umami"] as const).map((key) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-[9px] font-sans uppercase tracking-wider text-forest/50 capitalize">{key}</label>
                      <input type="number" min="1" max="10" value={(form as any)[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full border border-forest/15 bg-ivory text-center py-1.5 text-xs font-bold text-forest focus:outline-none focus:border-gold font-sans"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gold/15">
                <button type="button" onClick={() => setShowForm(false)} className="text-[11px] font-sans font-semibold uppercase tracking-wider text-forest/50 hover:text-forest cursor-pointer transition-colors">
                  Cancel
                </button>
                <Button type="submit" variant="secondary" size="md" disabled={saving} className="flex items-center gap-2 font-bold">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {saving ? "Saving…" : editingId ? "Save Changes" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-ivory border border-gold/15 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-forest/40 font-sans text-xs tracking-widest uppercase animate-pulse">
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-3">
            <ImageIcon className="w-8 h-8 text-gold/30" />
            <p className="text-forest/40 font-sans text-xs tracking-widest uppercase">No products yet</p>
            <Button onClick={openCreate} variant="outline" size="sm">Add your first product</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-gold/15 bg-forest/5 text-forest/50 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-forest/5 transition-all duration-200">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-forest/10 border border-gold/10 overflow-hidden flex-shrink-0">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-forest/20" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-forest text-sm leading-tight">{p.name}</p>
                          <p className="text-[10px] text-forest/40 mt-0.5">{p.origin || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gold/10 text-gold-dark border border-gold/15">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-forest">${p.price?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center text-forest/70">{p.stock ?? "—"}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => handleToggle(p)} className="cursor-pointer" title={p.active ? "Deactivate" : "Activate"}>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          p.active ? "bg-green-500/10 text-green-700 border-green-500/25" : "bg-red-500/10 text-red-700 border-red-500/25"
                        }`}>
                          {p.active ? <><Eye className="w-2.5 h-2.5" /> Live</> : <><EyeOff className="w-2.5 h-2.5" /> Hidden</>}
                        </span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-forest/40 hover:text-gold border border-transparent hover:border-gold/30 transition-all cursor-pointer" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 text-forest/40 hover:text-red-600 border border-transparent hover:border-red-500/30 transition-all cursor-pointer" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper components
const inputCls = "w-full bg-ivory-light border border-forest/15 px-3 py-2.5 text-xs text-forest placeholder:text-forest/30 focus:outline-none focus:border-gold transition-all duration-300 font-sans";

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-forest/60">
      {label}{required && <span className="text-gold ml-0.5">*</span>}
    </label>
    {children}
  </div>
);
