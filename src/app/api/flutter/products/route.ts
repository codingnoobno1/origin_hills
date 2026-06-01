import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const MOCK = [
  { id: "silver-needle", name: "Silver Needle Imperial", category: "White", tag: "Rare Reserve", origin: "Ilam Valley, Nepal", elevation: "2,200m", price: 48, image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800", stock: 150, active: true },
  { id: "gyokuro-jade", name: "Gyokuro Jade Dew", category: "Green", tag: "Imperial Grade", origin: "Uji Kyoto, Japan", elevation: "300m", price: 54, image: "https://images.unsplash.com/photo-1531215456674-d4c3a2ef975d?q=80&w=800", stock: 80, active: true },
  { id: "makaibari-black", name: "Makaibari First Flush", category: "Black", tag: "Equinox Crop", origin: "Darjeeling Hills, India", elevation: "1,600m", price: 42, image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800", stock: 120, active: true },
  { id: "phoenix-dancong", name: "Phoenix Cliff Oolong", category: "Oolong", tag: "Rocky Slope", origin: "Wuyi Cliffs, China", elevation: "1,000m", price: 62, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800", stock: 100, active: true },
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
