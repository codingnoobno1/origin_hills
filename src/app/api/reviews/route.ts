import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const MOCK_REVIEWS = [
  { _id: "r1", productId: "silver-needle", name: "Alistair V.", rating: 5, body: "Extraordinary clarity and delicate floral sweetness.", createdAt: new Date().toISOString() },
  { _id: "r2", productId: "gyokuro-jade", name: "Charlotte S.", rating: 5, body: "The umami depth is unlike anything I have tasted.", createdAt: new Date().toISOString() },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (isSandboxMode()) {
      const reviews = productId ? MOCK_REVIEWS.filter((r) => r.productId === productId) : MOCK_REVIEWS;
      return NextResponse.json({ success: true, reviews, isSandbox: true });
    }

    const db = await getDb();
    const query: any = {};
    if (productId) query.productId = productId;
    const reviews = await db.collection("reviews").find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, reviews });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, name, rating, body: reviewBody } = body;
    if (!productId || !rating || !reviewBody) {
      return NextResponse.json({ error: "productId, rating and body required" }, { status: 400 });
    }

    const doc = { productId, name, rating: Number(rating), body: reviewBody, createdAt: new Date().toISOString() };
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, review: { _id: "sandbox_r", ...doc }, isSandbox: true }, { status: 201 });
    }

    const db = await getDb();
    const result = await db.collection("reviews").insertOne(doc);
    return NextResponse.json({ success: true, review: { _id: result.insertedId, ...doc } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
