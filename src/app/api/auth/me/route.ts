import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ error: "x-user-email header required" }, { status: 401 });

    if (isSandboxMode()) {
      return NextResponse.json({
        success: true,
        user: { _id: "sandbox_user", name: "Demo Collector", email, preference: "rare", allocationStatus: "Approved" },
        isSandbox: true,
      });
    }

    const db = await getDb();
    const user = await db.collection("collectors").findOne({ email }, { projection: { passwordHash: 0, password: 0 } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ error: "x-user-email header required" }, { status: 401 });

    const body = await request.json();
    const { name, preference } = body;
    const updates: any = { updatedAt: new Date().toISOString() };
    if (name) updates.name = name;
    if (preference) updates.preference = preference;

    if (isSandboxMode()) {
      return NextResponse.json({ success: true, message: "Profile updated (sandbox)", isSandbox: true });
    }

    const db = await getDb();
    await db.collection("collectors").updateOne({ email }, { $set: updates });
    return NextResponse.json({ success: true, message: "Profile updated" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
