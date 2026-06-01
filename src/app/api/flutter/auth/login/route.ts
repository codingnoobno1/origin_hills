import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ status: "error", message: "email and password required" }, { status: 400 });

    if (isSandboxMode()) {
      if (email === "demo@originhills.com" && password === "demo") {
        return NextResponse.json({ status: "success", data: { user: { id: "sandbox_user", name: "Demo Collector", email, preference: "rare", allocationStatus: "Approved" }, token: "sandbox_token_abc123" }, isSandbox: true });
      }
      return NextResponse.json({ status: "error", message: "Invalid credentials" }, { status: 401 });
    }

    const db = await getDb();
    const user = await db.collection("collectors").findOne({ email });
    if (!user || (user.passwordHash !== password && user.password !== password)) {
      return NextResponse.json({ status: "error", message: "Invalid credentials" }, { status: 401 });
    }
    const { passwordHash, password: _pw, ...safe } = user;
    return NextResponse.json({ status: "success", data: { user: { ...safe, id: safe._id?.toString() }, token: `token_${user._id}` } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
