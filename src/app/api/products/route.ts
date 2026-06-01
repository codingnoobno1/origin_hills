import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const MOCK_PRODUCTS = [
  {
    _id: "signature-assam",
    name: "Signature Assam Orthodox",
    category: "Assam Heritage",
    tag: "Estate Reserve",
    origin: "Assam, India",
    elevation: "1,200m Altitude",
    price: 45.0,
    description:
      "The benchmark expression of Assam's tea heritage. Rich body, deep amber liquor, and remarkable aromatic complexity.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800",
    steepTemp: "95°C",
    steepTime: "4-5 min",
    tastingNotes: ["Rich Body", "Deep Amber Liquor", "Aromatic Complexity"],
    profiles: { aromatic: 9, mineral: 6, floral: 5, roasted: 7, umami: 4 },
    stock: 120,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "rose-noir",
    name: "Rose Noir Blend",
    category: "Floral Reserve",
    tag: "Limited Allocation",
    origin: "Assam, India",
    elevation: "1,200m Altitude",
    price: 55.0,
    description:
      "An elegant composition of premium orthodox black tea and hand-selected rose petals. The infusion reveals delicate floral notes balanced by the richness and depth of Assam tea. Designed for slow afternoons, meaningful conversations, and moments of quiet reflection.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800",
    steepTemp: "92°C",
    steepTime: "3-4 min",
    tastingNotes: ["Rose", "Wild Honey", "Velvet"],
    profiles: { aromatic: 10, mineral: 5, floral: 10, roasted: 2, umami: 3 },
    stock: 90,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "smoky-himalayan",
    name: "Smoky Himalayan Blend",
    category: "Mountain Reserve",
    tag: "Mountain Reserve",
    origin: "Himalayan Highlands",
    elevation: "1,800m Altitude",
    price: 60.0,
    description:
      "Inspired by mountain traditions and cool alpine air, this blend delivers exceptional depth and warmth. Its gentle smokiness unfolds gradually, revealing rich malt character and a lingering finish. A tea created for contemplative evenings and slow rituals.",
    image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800",
    steepTemp: "95°C",
    steepTime: "4-5 min",
    tastingNotes: ["Cedar", "Smoke", "Malt"],
    profiles: { aromatic: 8, mineral: 9, floral: 3, roasted: 10, umami: 4 },
    stock: 80,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "ceremonial-matcha",
    name: "Ceremonial Matcha",
    category: "Imperial Grade",
    tag: "Imperial Grade",
    origin: "Uji, Japan",
    elevation: "300m Altitude",
    price: 65.0,
    description:
      "Stone-ground from shade-grown tea leaves and crafted according to centuries-old Japanese tradition. This ceremonial matcha offers vibrant color, remarkable balance, and exceptional clarity. Ideal for focused mornings, mindful practice, and modern rituals.",
    image: "https://images.unsplash.com/photo-1531215456674-d4c3a2ef975d?q=80&w=800",
    steepTemp: "75°C",
    steepTime: "20 sec",
    tastingNotes: ["Umami", "Sweet Grass", "Fresh Cream"],
    profiles: { aromatic: 7, mineral: 4, floral: 2, roasted: 1, umami: 10 },
    stock: 60,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "collector-reserve",
    name: "Collector Reserve",
    category: "Collector Reserve",
    tag: "Rare Allocation",
    origin: "Upper Assam Estates",
    elevation: "1,500m Altitude",
    price: 85.0,
    description:
      "Rare seasonal releases available only in limited allocations. Comprised of extremely scarce micro-lots representing the absolute pinnacle of flavor concentration and masterly post-harvest aging.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800",
    steepTemp: "80°C",
    steepTime: "4 min",
    tastingNotes: ["Rare Vintages", "Intense Floral Honey", "Exceptional Depth"],
    profiles: { aromatic: 10, mineral: 8, floral: 9, roasted: 2, umami: 5 },
    stock: 40,
    active: true,
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const active = searchParams.get("active");

    if (isSandboxMode()) {
      let products = MOCK_PRODUCTS;
      if (category) products = products.filter((p) => p.category === category);
      if (active === "true") products = products.filter((p) => p.active);
      return NextResponse.json({ success: true, products, isSandbox: true });
    }

    const db = await getDb();
    const query: any = {};
    if (category) query.category = category;
    if (active === "true") query.active = true;

    const products = await db.collection("products").find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, tag, origin, elevation, price, description, image,
      steepTemp, steepTime, tastingNotes, profiles, stock } = body;

    if (!name || !category || !price) {
      return NextResponse.json({ error: "name, category and price are required" }, { status: 400 });
    }

    const product = {
      name, category, tag, origin, elevation,
      price: Number(price),
      description, image, steepTemp, steepTime,
      tastingNotes: tastingNotes || [],
      profiles: profiles || {},
      stock: Number(stock) || 0,
      active: true,
      createdAt: new Date().toISOString(),
    };

    if (isSandboxMode()) {
      return NextResponse.json({ success: true, product: { _id: "sandbox_new", ...product }, isSandbox: true });
    }

    const db = await getDb();
    const result = await db.collection("products").insertOne(product);
    return NextResponse.json({ success: true, product: { _id: result.insertedId, ...product } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
