import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET() {
  try {
    const DEFAULT = {
      hero: { headline: "Where soil, mist, and time steer perfection.", badge: "ESTATE RESERVE SELECTION", backgroundImage: "/tea_garden_header.png" },
      manifesto: "Time is the ultimate luxury. Steeping is the silent art of mastering it.",
      stats: [{ label: "Altitude", value: "2,200m" }, { label: "Estates", value: "4 Plots" }, { label: "Harvest", value: "Spring Flush" }],
    };
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: DEFAULT, isSandbox: true });
    const db = await getDb();
    const [hero, about] = await Promise.all([
      db.collection("content").findOne({ key: "hero" }),
      db.collection("content").findOne({ key: "about" }),
    ]);
    return NextResponse.json({ status: "success", data: { hero: hero?.data || DEFAULT.hero, manifesto: about?.data?.manifesto || DEFAULT.manifesto, stats: DEFAULT.stats } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
