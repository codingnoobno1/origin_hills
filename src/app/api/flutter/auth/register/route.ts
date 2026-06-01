import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { name, email, password, preference } = await request.json();
    if (!name || !email || !password) return NextResponse.json({ status: "error", message: "name, email and password required" }, { status: 400 });

    if (isSandboxMode()) {
      return NextResponse.json({ status: "success", data: { user: { id: "sandbox_new", name, email, preference, allocationStatus: "Pending Cellar Maturity" }, token: "sandbox_token_new" }, isSandbox: true });
    }

    const db = await getDb();
    const existing = await db.collection("collectors").findOne({ email });
    if (existing) return NextResponse.json({ status: "error", message: "Email already registered" }, { status: 409 });

    const doc = { name, email, passwordHash: password, preference: preference || "rare", allocationStatus: "Pending Cellar Maturity", allocationTins: 0, createdAt: new Date().toISOString() };
    const result = await db.collection("collectors").insertOne(doc);
    return NextResponse.json({ status: "success", data: { user: { id: result.insertedId.toString(), name, email, preference, allocationStatus: "Pending Cellar Maturity" }, token: `token_${result.insertedId}` } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
