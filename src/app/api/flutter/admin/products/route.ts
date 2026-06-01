import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET() {
  try {
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { products: [] }, isSandbox: true });
    const db = await getDb();
    const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ status: "success", data: { products: products.map((p: any) => ({ ...p, id: p._id?.toString() })) } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price) return NextResponse.json({ status: "error", message: "name and price required" }, { status: 400 });
    const product = { ...body, price: Number(body.price), active: true, createdAt: new Date().toISOString() };
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { product: { id: "sandbox_new", ...product } }, isSandbox: true }, { status: 201 });
    const db = await getDb();
    const result = await db.collection("products").insertOne(product);
    return NextResponse.json({ status: "success", data: { product: { id: result.insertedId.toString(), ...product } } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
