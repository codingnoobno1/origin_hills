import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const MOCK = [
  { id: "single-estate-orthodox", name: "Single Estate Orthodox", category: "Estate Collection", tag: "Estate Reserve", origin: "Upper Assam, India", elevation: "1,200m", price: 45, image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800", stock: 120, active: true },
  { id: "silver-needles", name: "Silver Needles", category: "Estate Collection", tag: "Grand Reserve", origin: "Darjeeling, India", elevation: "2,100m", price: 78, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800", stock: 40, active: true },
  { id: "rose-noir", name: "Rose Noir", category: "Signature Blends", tag: "Signature", origin: "Assam, India", elevation: "1,200m", price: 55, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800", stock: 90, active: true },
  { id: "smoky-himalayan", name: "Smoky Himalayan", category: "Signature Blends", tag: "Signature", origin: "Himalayan Highlands", elevation: "1,800m", price: 60, image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800", stock: 80, active: true },
  { id: "citrus-dawn", name: "Citrus Dawn", category: "Signature Blends", tag: "Signature", origin: "Assam & Ceylon", elevation: "800m", price: 48, image: "https://images.unsplash.com/photo-1531215456674-d4c3a2ef975d?q=80&w=800", stock: 100, active: true },
  { id: "digestive-blend", name: "Digestive Restore", category: "Wellness Reserve", tag: "Wellness", origin: "Assam & Botanical", elevation: "1,000m", price: 42, image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800", stock: 110, active: true },
  { id: "calm-sleep", name: "Calm & Sleep", category: "Wellness Reserve", tag: "Wellness", origin: "Botanical Blend", elevation: "—", price: 44, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800", stock: 95, active: true },
  { id: "rose-botanical", name: "Rose Botanical", category: "Floral Reserve", tag: "Floral", origin: "Assam & Rose Gardens", elevation: "1,100m", price: 52, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800", stock: 75, active: true },
  { id: "grand-silver-needles", name: "Grand Reserve Silver Needles", category: "Grand Reserve", tag: "Grand Reserve", origin: "Darjeeling, India", elevation: "2,400m", price: 120, image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800", stock: 20, active: true },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (isSandboxMode()) {
      let products = MOCK;
      if (category) products = products.filter((p) => p.category === category);
      return NextResponse.json({ status: "success", data: { products, total: products.length, page, limit }, isSandbox: true });
    }

    const db = await getDb();
    const query: any = { active: true };
    if (category) query.category = category;
    const total = await db.collection("products").countDocuments(query);
    const products = await db.collection("products").find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray();
    const normalised = products.map((p: any) => ({ ...p, id: p._id?.toString() }));
    return NextResponse.json({ status: "success", data: { products: normalised, total, page, limit } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
