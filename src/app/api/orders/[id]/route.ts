import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, order: { _id: id, status: "Sandbox" }, isSandbox: true });
    }
    const db = await getDb();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any };
    const order = await db.collection("orders").findOne(query);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ success: true, order });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!status) return NextResponse.json({ error: "status required" }, { status: 400 });

    if (isSandboxMode()) {
      return NextResponse.json({ success: true, message: "Order updated (sandbox)", isSandbox: true });
    }

    const db = await getDb();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any };
    await db.collection("orders").updateOne(query, { $set: { status, updatedAt: new Date().toISOString() } });
    return NextResponse.json({ success: true, message: "Order status updated" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
