import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { product: { id, name: "Sandbox Product", price: 0 } }, isSandbox: true });
    const db = await getDb();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any };
    const product = await db.collection("products").findOne(query);
    if (!product) return NextResponse.json({ status: "error", message: "Product not found" }, { status: 404 });
    return NextResponse.json({ status: "success", data: { product: { ...product, id: product._id?.toString() } } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
