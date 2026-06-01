import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET() {
  try {
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, products: [], isSandbox: true });
    }
    const db = await getDb();
    const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, tag, origin, elevation, price, description, image,
      steepTemp, steepTime, tastingNotes, profiles, stock } = body;

    if (!name || !category || !price) {
      return NextResponse.json({ error: "name, category and price are required" }, { status: 400 });
    }

    const product = {
      name, category, tag, origin, elevation,
      price: Number(price), description, image, steepTemp, steepTime,
      tastingNotes: tastingNotes || [], profiles: profiles || {},
      stock: Number(stock) || 0, active: true,
      createdAt: new Date().toISOString(),
    };

    if (isSandboxMode()) {
      return NextResponse.json({ success: true, product: { _id: "sandbox_new", ...product }, isSandbox: true });
    }

    const db = await getDb();
    const result = await db.collection("products").insertOne(product);
    return NextResponse.json({ success: true, product: { _id: result.insertedId, ...product } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
