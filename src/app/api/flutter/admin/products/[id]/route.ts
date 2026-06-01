import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates: any = { ...body, updatedAt: new Date().toISOString() };
    delete updates._id;
    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Product updated (sandbox)", isSandbox: true });
    const db = await getDb();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any };
    await db.collection("products").updateOne(query, { $set: updates });
    return NextResponse.json({ status: "success", message: "Product updated" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Product deleted (sandbox)", isSandbox: true });
    const db = await getDb();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any };
    await db.collection("products").deleteOne(query);
    return NextResponse.json({ status: "success", message: "Product deleted" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
