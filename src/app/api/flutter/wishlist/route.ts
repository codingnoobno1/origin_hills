import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email required" }, { status: 401 });
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { wishlist: [] }, isSandbox: true });
    const db = await getDb();
    const doc = await db.collection("wishlists").findOne({ email });
    return NextResponse.json({ status: "success", data: { wishlist: doc?.items || [] } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email required" }, { status: 401 });
    const { productId, name, price, image } = await request.json();
    if (!productId) return NextResponse.json({ status: "error", message: "productId required" }, { status: 400 });
    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Added to wishlist (sandbox)", isSandbox: true });
    const db = await getDb();
    await db.collection("wishlists").updateOne(
      { email },
      { $addToSet: { items: { productId, name, price, image, addedAt: new Date().toISOString() } } as any, $setOnInsert: { email } },
      { upsert: true }
    );
    return NextResponse.json({ status: "success", message: "Added to wishlist" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
