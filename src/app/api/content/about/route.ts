import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const DEFAULT_ABOUT = {
  manifesto: "Time is the ultimate luxury. Steeping is the silent art of mastering it.",
  body: "At Origin Hills, we pluck only the silver tips and pristine double-leaves during the fleeting golden hours of dawn. What we bottle is not just organic leaves, but the slow, patient breath of high elevation terroirs.",
  section1Title: "Quiet Luxury, harvested by hand.",
  section1Body: "In an era dominated by high-speed processing and artificial flavor enhancers, Origin Hills was founded to preserve the meditative, quiet sanctuary of slow steeping.",
  section2Title: "Oxidation & slow drying art.",
  section2Body: "Once harvested, the fragile leaves are transported immediately in padded bamboo baskets to our drying huts.",
};

export async function GET() {
  try {
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, about: DEFAULT_ABOUT, isSandbox: true });
    }
    const db = await getDb();
    const doc = await db.collection("content").findOne({ key: "about" });
    return NextResponse.json({ success: true, about: doc?.data || DEFAULT_ABOUT });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, message: "About content updated (sandbox)", isSandbox: true });
    }
    const db = await getDb();
    await db.collection("content").updateOne(
      { key: "about" },
      { $set: { key: "about", data: body, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true, message: "About content updated" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
