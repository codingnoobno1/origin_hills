import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "email and password required" }, { status: 400 });
    }

    if (isSandboxMode()) {
      if (email === "demo@originhills.com" && password === "demo") {
        return NextResponse.json({
          success: true,
          user: { _id: "sandbox_user", name: "Demo Collector", email, preference: "rare", allocationStatus: "Approved" },
          token: "sandbox_token_abc123",
          isSandbox: true,
        });
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const db = await getDb();
    const user = await db.collection("collectors").findOne({ email });
    if (!user) return NextResponse.json({ error: "No account found with this email" }, { status: 401 });

    // Simple password check (in production use bcrypt)
    if (user.passwordHash !== password && user.password !== password) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const { passwordHash, password: _pw, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser, token: `token_${user._id}` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
