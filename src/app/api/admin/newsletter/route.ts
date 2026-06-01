import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET() {
  try {
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, isSandbox: true, subscribers: [{ email: "demo@originhills.com", subscribedAt: new Date().toISOString() }], count: 1 });
    }
    const db = await getDb();
    const subscribers = await db.collection("newsletter").find({}).sort({ subscribedAt: -1 }).toArray();
    return NextResponse.json({ success: true, subscribers, count: subscribers.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
    if (isSandboxMode()) return NextResponse.json({ success: true, message: "Subscriber removed (sandbox)", isSandbox: true });
    const db = await getDb();
    await db.collection("newsletter").deleteOne({ email });
    return NextResponse.json({ success: true, message: "Subscriber removed" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
