import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const MOCK = [
  { id: "white", name: "Silver Needle White", type: "Imperial Down Buds", temp: 80, timeSec: 240, leavesGrams: 3, vessel: "Pre-warmed Glass or Gaiwan", description: "Requires cool, delicate spring water to preserve fragile trichomes." },
  { id: "green", name: "Gyokuro Jade Green", type: "Shaded Tencha Leaf", temp: 60, timeSec: 120, leavesGrams: 5, vessel: "Shiboridashi or Kyusu Claypot", description: "Brewed at cooled temperatures with high leaf ratios to unlock savory umami." },
  { id: "black", name: "First Flush Darjeeling", type: "Tippy Golden Flowery Orange Pekoe", temp: 90, timeSec: 180, leavesGrams: 3, vessel: "Fine Porcelain Teapot", description: "High mountain spring water just off boil for muscatel release." },
  { id: "oolong", name: "Wuyi Cliffs Oolong", type: "Heavy Roasted Cliff Leaves", temp: 95, timeSec: 45, leavesGrams: 6, vessel: "Yixing Purple Zisha Clay", description: "Flash-brews inside pre-heated porous clay vessels for consecutive short steeps." },
];

export async function GET() {
  try {
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { guides: MOCK }, isSandbox: true });
    const db = await getDb();
    const guides = await db.collection("brewing_guides").find({}).toArray();
    return NextResponse.json({ status: "success", data: { guides: guides.length ? guides.map((g: any) => ({ ...g, id: g._id?.toString() })) : MOCK } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
