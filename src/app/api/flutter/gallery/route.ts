import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const MOCK = [
  { id: "g1", url: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800", caption: "Silver Needle harvest", category: "harvest" },
  { id: "g2", url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800", caption: "Wuyi cliff gardens", category: "terroir" },
  { id: "g3", url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800", caption: "Drying process", category: "process" },
  { id: "g4", url: "https://images.unsplash.com/photo-1531215456674-d4c3a2ef975d?q=80&w=800", caption: "Gyokuro shading", category: "process" },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    if (isSandboxMode()) {
      const gallery = category ? MOCK.filter((g) => g.category === category) : MOCK;
      return NextResponse.json({ status: "success", data: { gallery }, isSandbox: true });
    }
    const db = await getDb();
    const query: any = {};
    if (category) query.category = category;
    const items = await db.collection("gallery").find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ status: "success", data: { gallery: items.map((i: any) => ({ ...i, id: i._id?.toString() })) } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
