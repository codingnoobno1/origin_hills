import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email required" }, { status: 401 });
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { cart: [], total: 0 }, isSandbox: true });
    const db = await getDb();
    const cart = await db.collection("carts").findOne({ email });
    return NextResponse.json({ status: "success", data: { cart: cart?.items || [], total: cart?.total || 0 } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email required" }, { status: 401 });
    const { productId, name, price, qty, image } = await request.json();
    if (!productId) return NextResponse.json({ status: "error", message: "productId required" }, { status: 400 });

    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Item added to cart (sandbox)", isSandbox: true });

    const db = await getDb();
    const existing = await db.collection("carts").findOne({ email });
    if (existing) {
      const items: any[] = existing.items || [];
      const idx = items.findIndex((i: any) => i.productId === productId);
      if (idx >= 0) {
        items[idx].qty = Math.min(3, items[idx].qty + (qty || 1));
      } else {
        items.push({ productId, name, price, qty: qty || 1, image });
      }
      const total = items.reduce((a: number, i: any) => a + i.price * i.qty, 0);
      await db.collection("carts").updateOne({ email }, { $set: { items, total, updatedAt: new Date().toISOString() } });
    } else {
      const items = [{ productId, name, price, qty: qty || 1, image }];
      const total = price * (qty || 1);
      await db.collection("carts").insertOne({ email, items, total, createdAt: new Date().toISOString() });
    }
    return NextResponse.json({ status: "success", message: "Item added to cart" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email required" }, { status: 401 });
    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Cart cleared (sandbox)", isSandbox: true });
    const db = await getDb();
    await db.collection("carts").deleteOne({ email });
    return NextResponse.json({ status: "success", message: "Cart cleared" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
