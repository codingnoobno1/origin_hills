import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const MOCK_ORDERS = [
  {
    _id: "order_001",
    userEmail: "alistair@vance.com",
    items: [{ productId: "silver-needle", name: "Silver Needle Imperial", qty: 2, price: 48 }],
    total: 96,
    status: "Confirmed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    customerInfo: {
      fullName: "Alistair Vance",
      phone: "9876543210",
      email: "alistair@vance.com",
      addressLine1: "12, Regency Court",
      addressLine2: "Lavelle Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001"
    }
  },
  {
    _id: "order_002",
    userEmail: "charlotte@sterling.com",
    items: [{ productId: "gyokuro-jade", name: "Gyokuro Jade Dew", qty: 1, price: 54 }],
    total: 54,
    status: "Pending Review",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    customerInfo: {
      fullName: "Charlotte Sterling",
      phone: "9812345678",
      email: "charlotte@sterling.com",
      addressLine1: "Suite 404, Sterling Towers",
      addressLine2: "Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050"
    }
  },
];

export async function GET() {
  try {
    if (isSandboxMode()) return NextResponse.json({ success: true, orders: MOCK_ORDERS, isSandbox: true });
    const db = await getDb();
    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, orders });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });
    if (isSandboxMode()) return NextResponse.json({ success: true, message: "Order updated (sandbox)", isSandbox: true });

    const db = await getDb();
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as any };
    await db.collection("orders").updateOne(query, { $set: { status, updatedAt: new Date().toISOString() } });
    return NextResponse.json({ success: true, message: "Order status updated" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
