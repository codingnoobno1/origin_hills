import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { terroir: { id, name: "Sandbox Terroir" } }, isSandbox: true });
    const db = await getDb();
    const terroir = await db.collection("terroirs").findOne({ _id: id as any });
    if (!terroir) return NextResponse.json({ status: "error", message: "Terroir not found" }, { status: 404 });
    return NextResponse.json({ status: "success", data: { terroir: { ...terroir, id: terroir._id?.toString() } } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
