import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email required" }, { status: 401 });
    const { id } = await params;
    if (isSandboxMode()) return NextResponse.json({ status: "success", message: "Removed from wishlist (sandbox)", isSandbox: true });
    const db = await getDb();
    await db.collection("wishlists").updateOne({ email }, { $pull: { items: { productId: id } } as any });
    return NextResponse.json({ status: "success", message: "Removed from wishlist" });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
