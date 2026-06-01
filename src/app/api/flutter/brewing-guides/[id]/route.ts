import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const MOCK: Record<string, any> = {
  white: { id: "white", name: "Silver Needle White", temp: 80, timeSec: 240, leavesGrams: 3, vessel: "Pre-warmed Glass or Gaiwan" },
  green: { id: "green", name: "Gyokuro Jade Green", temp: 60, timeSec: 120, leavesGrams: 5, vessel: "Shiboridashi or Kyusu Claypot" },
  black: { id: "black", name: "First Flush Darjeeling", temp: 90, timeSec: 180, leavesGrams: 3, vessel: "Fine Porcelain Teapot" },
  oolong: { id: "oolong", name: "Wuyi Cliffs Oolong", temp: 95, timeSec: 45, leavesGrams: 6, vessel: "Yixing Purple Zisha Clay" },
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (isSandboxMode()) {
      const guide = MOCK[id];
      if (!guide) return NextResponse.json({ status: "error", message: "Guide not found" }, { status: 404 });
      return NextResponse.json({ status: "success", data: { guide }, isSandbox: true });
    }
    const db = await getDb();
    const guide = await db.collection("brewing_guides").findOne({ _id: id as any });
    if (!guide) return NextResponse.json({ status: "error", message: "Guide not found" }, { status: 404 });
    return NextResponse.json({ status: "success", data: { guide: { ...guide, id: guide._id?.toString() } } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
