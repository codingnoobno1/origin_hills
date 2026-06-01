import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const MOCK_PRODUCTS = [
  {
    _id: "single-estate-orthodox",
    name: "Single Estate Orthodox",
    category: "Estate Collection",
    tag: "Estate Reserve",
    origin: "Upper Assam, India",
    elevation: "1,200m Altitude",
    price: 45.0,
    description: "The benchmark expression of Assam's tea heritage. A pure, unadulterated single-estate orthodox black tea offering rich body, deep amber liquor, and remarkable aromatic complexity.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800",
    steepTemp: "95°C", steepTime: "4-5 min",
    tastingNotes: ["Malt", "Amber Honey", "Stonefruit"],
    profiles: { aromatic: 9, mineral: 6, floral: 5, roasted: 7, umami: 4 },
    stock: 120, active: true, createdAt: new Date().toISOString(),
  },
  {
    _id: "silver-needles",
    name: "Silver Needles",
    category: "Estate Collection",
    tag: "Grand Reserve",
    origin: "Darjeeling, India",
    elevation: "2,100m Altitude",
    price: 78.0,
    description: "Comprised exclusively of young, downy buds hand-plucked during the vernal dawn. A pristine white tea offering velvet liquor with delicate notes of clover honey and alpine meadow.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800",
    steepTemp: "75°C", steepTime: "4 min",
    tastingNotes: ["Clover Honey", "Alpine Meadow", "White Blossom"],
    profiles: { aromatic: 9, mineral: 7, floral: 9, roasted: 1, umami: 5 },
    stock: 40, active: true, createdAt: new Date().toISOString(),
  },
  {
    _id: "rose-noir",
    name: "Rose Noir",
    category: "Signature Blends",
    tag: "Signature",
    origin: "Assam, India",
    elevation: "1,200m Altitude",
    price: 55.0,
    description: "An elegant composition of premium orthodox black tea and hand-selected rose petals. Delicate floral notes balanced by the richness of Assam — designed for slow afternoons and quiet reflection.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800",
    steepTemp: "92°C", steepTime: "3-4 min",
    tastingNotes: ["Rose Petal", "Wild Honey", "Velvet Finish"],
    profiles: { aromatic: 10, mineral: 5, floral: 10, roasted: 2, umami: 3 },
    stock: 90, active: true, createdAt: new Date().toISOString(),
  },
  {
    _id: "smoky-himalayan",
    name: "Smoky Himalayan",
    category: "Signature Blends",
    tag: "Signature",
    origin: "Himalayan Highlands",
    elevation: "1,800m Altitude",
    price: 60.0,
    description: "Inspired by mountain traditions and wood-fired craft. Gentle smokiness unfolds gradually, revealing layered cedarwood, deep malt character, and a lingering warmth.",
    image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800",
    steepTemp: "95°C", steepTime: "4-5 min",
    tastingNotes: ["Cedar", "Smoke", "Rich Malt"],
    profiles: { aromatic: 8, mineral: 9, floral: 3, roasted: 10, umami: 4 },
    stock: 80, active: true, createdAt: new Date().toISOString(),
  },
  {
    _id: "citrus-dawn",
    name: "Citrus Dawn",
    category: "Signature Blends",
    tag: "Signature",
    origin: "Assam & Ceylon",
    elevation: "800m Altitude",
    price: 48.0,
    description: "A bright, invigorating morning blend combining fine Assam orthodox with natural bergamot and citrus botanicals. Crisp, clean, and deeply reviving.",
    image: "https://images.unsplash.com/photo-1531215456674-d4c3a2ef975d?q=80&w=800",
    steepTemp: "90°C", steepTime: "3 min",
    tastingNotes: ["Bergamot", "Lemon Zest", "Fresh Tea"],
    profiles: { aromatic: 10, mineral: 4, floral: 7, roasted: 3, umami: 2 },
    stock: 100, active: true, createdAt: new Date().toISOString(),
  },
  {
    _id: "digestive-blend",
    name: "Digestive Restore",
    category: "Wellness Reserve",
    tag: "Wellness",
    origin: "Assam & Botanical",
    elevation: "1,000m Altitude",
    price: 42.0,
    description: "A carefully formulated wellness blend combining fine Assam orthodox with ginger, fennel, and digestive botanicals for daily post-meal ritual.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800",
    steepTemp: "95°C", steepTime: "5 min",
    tastingNotes: ["Ginger Warmth", "Fennel", "Clean Finish"],
    profiles: { aromatic: 8, mineral: 5, floral: 3, roasted: 4, umami: 6 },
    stock: 110, active: true, createdAt: new Date().toISOString(),
  },
  {
    _id: "calm-sleep",
    name: "Calm & Sleep",
    category: "Wellness Reserve",
    tag: "Wellness",
    origin: "Botanical Blend",
    elevation: "—",
    price: 44.0,
    description: "An evening blend formulated with chamomile, lavender, and ashwagandha on a delicate white tea base. Crafted for transition, rest, and intentional unwinding.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800",
    steepTemp: "80°C", steepTime: "6 min",
    tastingNotes: ["Chamomile", "Lavender", "Soft Vanilla"],
    profiles: { aromatic: 9, mineral: 2, floral: 10, roasted: 1, umami: 1 },
    stock: 95, active: true, createdAt: new Date().toISOString(),
  },
  {
    _id: "rose-botanical",
    name: "Rose Botanical",
    category: "Floral Reserve",
    tag: "Floral",
    origin: "Assam & Rose Gardens",
    elevation: "1,100m Altitude",
    price: 52.0,
    description: "An elegant botanical composition featuring whole dried rose buds layered with a delicate Darjeeling base. Pure aromatic luxury in every steep.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800",
    steepTemp: "85°C", steepTime: "3-4 min",
    tastingNotes: ["Rose", "Honey Nectar", "Floral Dew"],
    profiles: { aromatic: 10, mineral: 4, floral: 10, roasted: 1, umami: 2 },
    stock: 75, active: true, createdAt: new Date().toISOString(),
  },
  {
    _id: "grand-silver-needles",
    name: "Grand Reserve Silver Needles",
    category: "Grand Reserve",
    tag: "Grand Reserve",
    origin: "Darjeeling, India",
    elevation: "2,400m Altitude",
    price: 120.0,
    description: "The pinnacle of Origin Hills craftsmanship. An extraordinary single-harvest Silver Needle, available in the most limited allocation — a defining expression of elevation, patience, and purity.",
    image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800",
    steepTemp: "72°C", steepTime: "4-5 min",
    tastingNotes: ["Honey Dew", "Alpine Air", "Silken Finish"],
    profiles: { aromatic: 10, mineral: 9, floral: 10, roasted: 1, umami: 6 },
    stock: 20, active: true, createdAt: new Date().toISOString(),
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
