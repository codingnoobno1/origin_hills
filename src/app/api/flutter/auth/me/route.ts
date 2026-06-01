import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email header required" }, { status: 401 });

    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { user: { id: "sandbox_user", name: "Demo Collector", email, preference: "rare", allocationStatus: "Approved", allocationTins: 2 } }, isSandbox: true });

    const db = await getDb();
    const user = await db.collection("collectors").findOne({ email }, { projection: { passwordHash: 0, password: 0 } });
    if (!user) return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 });
    return NextResponse.json({ status: "success", data: { user: { ...user, id: user._id?.toString() } } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email header required" }, { status: 401 });
    const body = await request.json();
    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Profile updated (sandbox)", isSandbox: true });
    const db = await getDb();
    await db.collection("collectors").updateOne({ email }, { $set: { ...body, updatedAt: new Date().toISOString() } });
    return NextResponse.json({ status: "success", message: "Profile updated" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
