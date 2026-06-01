import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email) return NextResponse.json({ status: "error", message: "email required" }, { status: 400 });
    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Subscribed (sandbox)", isSandbox: true });
    const db = await getDb();
    const existing = await db.collection("newsletter").findOne({ email });
    if (existing) return NextResponse.json({ status: "success", message: "Already subscribed" });
    await db.collection("newsletter").insertOne({ email, name, subscribedAt: new Date().toISOString() });
    return NextResponse.json({ status: "success", message: "Successfully subscribed to Origin Hills dispatch" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
