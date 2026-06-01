import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

    if (isSandboxMode()) {
      return NextResponse.json({ success: true, message: "Subscribed to newsletter (sandbox)", isSandbox: true });
    }

    const db = await getDb();
    const existing = await db.collection("newsletter").findOne({ email });
    if (existing) return NextResponse.json({ success: true, message: "Already subscribed" });

    await db.collection("newsletter").insertOne({ email, name, subscribedAt: new Date().toISOString() });
    return NextResponse.json({ success: true, message: "Successfully subscribed to Origin Hills dispatch" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, subscribers: [{ email: "demo@originhills.com", subscribedAt: new Date().toISOString() }], isSandbox: true });
    }
    const db = await getDb();
    const subscribers = await db.collection("newsletter").find({}).sort({ subscribedAt: -1 }).toArray();
    return NextResponse.json({ success: true, subscribers, count: subscribers.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
