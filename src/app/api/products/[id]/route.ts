import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, product: { _id: id, name: "Sandbox Product" }, isSandbox: true });
    }
    const db = await getDb();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any };
    const product = await db.collection("products").findOne(query);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updates: any = { ...body, updatedAt: new Date().toISOString() };
    delete updates._id;

    if (isSandboxMode()) {
      return NextResponse.json({ success: true, message: "Product updated (sandbox)", isSandbox: true });
    }

    const db = await getDb();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any };
    const result = await db.collection("products").updateOne(query, { $set: updates });
    if (result.matchedCount === 0) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Product updated" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, message: "Product deleted (sandbox)", isSandbox: true });
    }
    const db = await getDb();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any };
    const result = await db.collection("products").deleteOne(query);
    if (result.deletedCount === 0) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
