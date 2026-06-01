import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, productId, userEmail, meta } = body;
    if (!event) return NextResponse.json({ error: "event required" }, { status: 400 });

    const doc = { event, productId, userEmail, meta, timestamp: new Date().toISOString() };
    if (isSandboxMode()) return NextResponse.json({ success: true, isSandbox: true });

    const db = await getDb();
    await db.collection("analytics").insertOne(doc);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
