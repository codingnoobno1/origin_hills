import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

const MOCK_TERROIRS = [
  { _id: "darjeeling", name: "Makaibari Hills", country: "Darjeeling, India", elevation: "1,500m - 1,800m", terroir: "Subtropical misty forest loam", crop: "First Flush Black Pearl Tea", coordinates: "26.8529° N, 88.2636° E", description: "Nestled in the foothills of the Himalayas, blessed by dense high-altitude mists." },
  { _id: "uji", name: "Uji Kyoto Gardens", country: "Kyoto, Japan", elevation: "200m - 350m", terroir: "Alluvial river clay, shade canvas covered", crop: "Ceremonial Gyokuro Jade Dew", coordinates: "34.8906° N, 135.8039° E", description: "Rolling mist-kissed hills shaded for 20 days prior to plucking." },
  { _id: "wuyi", name: "Wuyi Cliffs", country: "Fujian, China", elevation: "900m - 1,100m", terroir: "Volcanic mineral rock crevices", crop: "Phoenix Dancong Oolong", coordinates: "27.6496° N, 117.9868° E", description: "Tea bushes grow directly inside steep volcanic rock gorges." },
  { _id: "ilam", name: "Ilam Valleys", country: "Ilam, Nepal", elevation: "2,100m - 2,400m", terroir: "Pristine glacial slate soils", crop: "Silver Needle Imperial White", coordinates: "26.9117° N, 87.9255° E", description: "Cultivated at the absolute ceiling of tea growth." },
];

export async function GET() {
  try {
    if (isSandboxMode()) {
      return NextResponse.json({ success: true, terroirs: MOCK_TERROIRS, isSandbox: true });
    }
    const db = await getDb();
    const terroirs = await db.collection("terroirs").find({}).toArray();
    return NextResponse.json({ success: true, terroirs: terroirs.length ? terroirs : MOCK_TERROIRS });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: "name required" }, { status: 400 });
    const doc = { ...body, createdAt: new Date().toISOString() };
    if (isSandboxMode()) return NextResponse.json({ success: true, terroir: { _id: "sandbox_t", ...doc }, isSandbox: true });
    const db = await getDb();
    const result = await db.collection("terroirs").insertOne(doc);
    return NextResponse.json({ success: true, terroir: { _id: result.insertedId, ...doc } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
