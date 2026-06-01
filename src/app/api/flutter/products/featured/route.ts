import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET() {
  try {
    if (isSandboxMode()) {
      return NextResponse.json({ status: "success", data: { products: [
        { id: "silver-needle", name: "Silver Needle Imperial", category: "White", price: 48, image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800", tag: "Rare Reserve" },
        { id: "phoenix-dancong", name: "Phoenix Cliff Oolong", category: "Oolong", price: 62, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800", tag: "Rocky Slope" },
      ]}, isSandbox: true });
    }
    const db = await getDb();
    const products = await db.collection("products").find({ featured: true, active: true }).limit(6).toArray();
    const normalised = products.map((p: any) => ({ ...p, id: p._id?.toString() }));
    return NextResponse.json({ status: "success", data: { products: normalised } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
