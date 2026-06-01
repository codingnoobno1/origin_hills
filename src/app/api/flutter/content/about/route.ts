import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET() {
  try {
    const DEFAULT = {
      manifesto: "Time is the ultimate luxury. Steeping is the silent art of mastering it.",
      story: "At Origin Hills, we pluck only the silver tips and pristine double-leaves during the fleeting golden hours of dawn.",
      values: ["Single-Estate Sourced", "Certified Organic", "Micro-Batch Lots", "Ethical Harvest"],
      established: "2026",
      locations: ["Darjeeling, India", "Uji, Japan", "Wuyi, China", "Ilam, Nepal"],
    };
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: DEFAULT, isSandbox: true });
    const db = await getDb();
    const doc = await db.collection("content").findOne({ key: "about" });
    return NextResponse.json({ status: "success", data: doc?.data || DEFAULT });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
