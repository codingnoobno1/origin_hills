import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const MOCK_GALLERY = [
  { _id: "g1", url: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800", caption: "Silver Needle harvest", category: "harvest" },
  { _id: "g2", url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800", caption: "Wuyi cliff gardens", category: "terroir" },
  { _id: "g3", url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800", caption: "Drying process", category: "process" },
  { _id: "g4", url: "https://images.unsplash.com/photo-1531215456674-d4c3a2ef975d?q=80&w=800", caption: "Gyokuro shading", category: "process" },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (isSandboxMode()) {
      const gallery = category ? MOCK_GALLERY.filter((g) => g.category === category) : MOCK_GALLERY;
      return NextResponse.json({ success: true, gallery, isSandbox: true });
    }

    const db = await getDb();
    const query: any = {};
    if (category) query.category = category;
    const gallery = await db.collection("gallery").find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, gallery });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, caption, category } = body;
    if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

    const doc = { url, caption, category, createdAt: new Date().toISOString() };
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, item: { _id: "sandbox_g", ...doc }, isSandbox: true });
    }
    const db = await getDb();
    const result = await db.collection("gallery").insertOne(doc);
    return NextResponse.json({ success: true, item: { _id: result.insertedId, ...doc } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    if (isSandboxMode()) {
      return NextResponse.json({ success: true, message: "Gallery item deleted (sandbox)", isSandbox: true });
    }

    const db = await getDb();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any };
    await db.collection("gallery").deleteOne(query);
    return NextResponse.json({ success: true, message: "Gallery item deleted" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
