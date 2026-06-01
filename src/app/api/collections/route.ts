import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const MOCK_COLLECTIONS = [
  { _id: "white", name: "White Tea Reserve", description: "Rare downy buds from high altitude", count: 1 },
  { _id: "green", name: "Imperial Green", description: "Shade-grown ceremonial grade", count: 1 },
  { _id: "black", name: "First Flush Black", description: "Spring equinox harvest", count: 1 },
  { _id: "oolong", name: "Cliff Oolong", description: "Volcanic rock mineral terroir", count: 1 },
];

export async function GET() {
  try {
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, collections: MOCK_COLLECTIONS, isSandbox: true });
    }
    const db = await getDb();
    const collections = await db.collection("collections").find({}).sort({ name: 1 }).toArray();
    return NextResponse.json({ success: true, collections });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

    const doc = { name, description, createdAt: new Date().toISOString() };
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, collection: { _id: "sandbox_col", ...doc }, isSandbox: true });
    }
    const db = await getDb();
    const result = await db.collection("collections").insertOne(doc);
    return NextResponse.json({ success: true, collection: { _id: result.insertedId, ...doc } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
