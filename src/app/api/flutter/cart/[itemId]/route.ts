import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function PATCH(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email required" }, { status: 401 });
    const { itemId } = await params;
    const { qty } = await request.json();
    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Cart item updated (sandbox)", isSandbox: true });
    const db = await getDb();
    await db.collection("carts").updateOne({ email, "items.productId": itemId }, { $set: { "items.$.qty": Math.min(3, Math.max(1, qty)) } });
    return NextResponse.json({ status: "success", message: "Cart item updated" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email required" }, { status: 401 });
    const { itemId } = await params;
    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Cart item removed (sandbox)", isSandbox: true });
    const db = await getDb();
    await db.collection("carts").updateOne({ email }, { $pull: { items: { productId: itemId } } as any });
    return NextResponse.json({ status: "success", message: "Cart item removed" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
