import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const MOCK_ORDERS = [
  {
    _id: "order_001",
    userEmail: "alistair@vance.com",
    items: [{ productId: "silver-needle", name: "Silver Needle Imperial", qty: 2, price: 48 }],
    total: 96,
    status: "Confirmed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (isSandboxMode()) {
      const orders = email ? MOCK_ORDERS.filter((o) => o.userEmail === email) : MOCK_ORDERS;
      return NextResponse.json({ success: true, orders, isSandbox: true });
    }

    const db = await getDb();
    const query: any = {};
    if (email) query.userEmail = email;
    const orders = await db.collection("orders").find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, orders });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, items, total, note } = body;
    if (!userEmail || !items || !total) {
      return NextResponse.json({ error: "userEmail, items and total required" }, { status: 400 });
    }

    const order = {
      userEmail, items, total: Number(total), note,
      status: "Pending Review",
      createdAt: new Date().toISOString(),
    };

    if (isSandboxMode()) {
      return NextResponse.json({ success: true, order: { _id: "sandbox_order", ...order }, isSandbox: true }, { status: 201 });
    }

    const db = await getDb();
    const result = await db.collection("orders").insertOne(order);
    return NextResponse.json({ success: true, order: { _id: result.insertedId, ...order } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
