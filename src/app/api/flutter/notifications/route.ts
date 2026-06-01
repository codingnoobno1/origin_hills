import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, token, platform } = await request.json();
    if (!token) return NextResponse.json({ status: "error", message: "device token required" }, { status: 400 });
    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Device registered for notifications (sandbox)", isSandbox: true });
    const db = await getDb();
    await db.collection("push_tokens").updateOne(
      { token },
      { $set: { token, email, platform: platform || "unknown", updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    return NextResponse.json({ status: "success", message: "Device registered for Origin Hills notifications" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
