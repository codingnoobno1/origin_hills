import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "9999");

    if (isSandboxMode()) {
      const MOCK = [
        { id: "silver-needle", name: "Silver Needle Imperial", category: "White", price: 48 },
        { id: "gyokuro-jade", name: "Gyokuro Jade Dew", category: "Green", price: 54 },
        { id: "makaibari-black", name: "Makaibari First Flush", category: "Black", price: 42 },
        { id: "phoenix-dancong", name: "Phoenix Cliff Oolong", category: "Oolong", price: 62 },
      ];
      const results = MOCK.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) && p.price >= minPrice && p.price <= maxPrice
      );
      return NextResponse.json({ status: "success", data: { results, total: results.length }, isSandbox: true });
    }

    const db = await getDb();
    const query: any = { active: true, price: { $gte: minPrice, $lte: maxPrice } };
    if (q) query.$or = [{ name: { $regex: q, $options: "i" } }, { category: { $regex: q, $options: "i" } }, { origin: { $regex: q, $options: "i" } }];
    const results = await db.collection("products").find(query).limit(20).toArray();
    const normalised = results.map((p: any) => ({ ...p, id: p._id?.toString() }));
    return NextResponse.json({ status: "success", data: { results: normalised, total: normalised.length } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
