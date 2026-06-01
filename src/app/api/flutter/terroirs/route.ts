import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const MOCK = [
  { id: "darjeeling", name: "Makaibari Hills", country: "Darjeeling, India", elevation: "1,500m - 1,800m", crop: "First Flush Black Pearl Tea", coordinates: "26.8529° N, 88.2636° E" },
  { id: "uji", name: "Uji Kyoto Gardens", country: "Kyoto, Japan", elevation: "200m - 350m", crop: "Ceremonial Gyokuro Jade Dew", coordinates: "34.8906° N, 135.8039° E" },
  { id: "wuyi", name: "Wuyi Cliffs", country: "Fujian, China", elevation: "900m - 1,100m", crop: "Phoenix Dancong Oolong", coordinates: "27.6496° N, 117.9868° E" },
  { id: "ilam", name: "Ilam Valleys", country: "Ilam, Nepal", elevation: "2,100m - 2,400m", crop: "Silver Needle Imperial White", coordinates: "26.9117° N, 87.9255° E" },
];

export async function GET() {
  try {
    if (isSandboxMode()) return NextResponse.json({ status: "success", data: { terroirs: MOCK }, isSandbox: true });
    const db = await getDb();
    const terroirs = await db.collection("terroirs").find({}).toArray();
    return NextResponse.json({ status: "success", data: { terroirs: terroirs.length ? terroirs.map((t: any) => ({ ...t, id: t._id?.toString() })) : MOCK } });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
