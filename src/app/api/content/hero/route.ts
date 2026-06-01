import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const DEFAULT_HERO = {
  headline: "Where soil, mist, and time steer perfection.",
  subheadline: "An exquisite registry of limited micro-batch tea allocations, hand-plucked in high-altitude clouds and crafted for collectors of the ultimate steeping luxury.",
  badge: "ESTATE RESERVE SELECTION",
  ctaPrimary: "Explore Reserve",
  ctaSecondary: "Request Allocation",
  backgroundImage: "/tea_garden_header.png",
  coordinates: "KANCHENJUNGA 27.7025° N, 88.1475° E",
  established: "EST. 2026",
};

export async function GET() {
  try {
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, hero: DEFAULT_HERO, isSandbox: true });
    }
    const db = await getDb();
    const hero = await db.collection("content").findOne({ key: "hero" });
    return NextResponse.json({ success: true, hero: hero?.data || DEFAULT_HERO });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, message: "Hero updated (sandbox)", isSandbox: true });
    }
    const db = await getDb();
    await db.collection("content").updateOne(
      { key: "hero" },
      { $set: { key: "hero", data: body, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true, message: "Hero content updated" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
