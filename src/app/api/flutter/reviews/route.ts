import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { reviews: [{ id: "r1", productId: productId || "silver-needle", name: "Alistair V.", rating: 5, body: "Extraordinary clarity.", createdAt: new Date().toISOString() }] }, isSandbox: true });
    const db = await getDb();
    const query: any = {};
    if (productId) query.productId = productId;
    const reviews = await db.collection("reviews").find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ status: "success", data: { reviews: reviews.map((r: any) => ({ ...r, id: r._id?.toString() })) } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    const { productId, name, rating, body } = await request.json();
    if (!productId || !rating || !body) return NextResponse.json({ status: "error", message: "productId, rating and body required" }, { status: 400 });
    const doc = { productId, name: name || email || "Anonymous", rating: Number(rating), body, userEmail: email, createdAt: new Date().toISOString() };
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { review: { id: "sandbox_r", ...doc } }, isSandbox: true }, { status: 201 });
    const db = await getDb();
    const result = await db.collection("reviews").insertOne(doc);
    return NextResponse.json({ status: "success", data: { review: { id: result.insertedId.toString(), ...doc } } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
