import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email required" }, { status: 401 });
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { orders: [{ id: "order_001", total: 96, status: "Confirmed", createdAt: new Date().toISOString() }] }, isSandbox: true });
    const db = await getDb();
    const orders = await db.collection("orders").find({ userEmail: email }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ status: "success", data: { orders: orders.map((o: any) => ({ ...o, id: o._id?.toString() })) } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) return NextResponse.json({ status: "error", message: "x-user-email required" }, { status: 401 });
    const { items, total, deliveryAddress, note } = await request.json();
    if (!items || !total) return NextResponse.json({ status: "error", message: "items and total required" }, { status: 400 });

    const order = { userEmail: email, items, total: Number(total), deliveryAddress, note, status: "Pending Review", createdAt: new Date().toISOString() };
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { order: { id: "sandbox_order", ...order } }, isSandbox: true }, { status: 201 });

    const db = await getDb();
    const result = await db.collection("orders").insertOne(order);
    // Clear cart after order
    await db.collection("carts").deleteOne({ email });
    return NextResponse.json({ status: "success", data: { order: { id: result.insertedId.toString(), ...order } } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
