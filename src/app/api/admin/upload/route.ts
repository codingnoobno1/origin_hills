import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxSize = 4 * 1024 * 1024; // 4 MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Max 4 MB." }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP and GIF are allowed." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const doc = {
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      data: dataUri,
      uploadedAt: new Date().toISOString(),
    };

    if (isSandboxMode()) {
      return NextResponse.json({
        success: true,
        isSandbox: true,
        imageId: "sandbox_img_001",
        url: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800",
        message: "Sandbox mode: returning placeholder URL",
      });
    }

    const db = await getDb();
    const result = await db.collection("images").insertOne(doc);
    const imageId = result.insertedId.toString();

    return NextResponse.json({
      success: true,
      imageId,
      url: `/api/images/${imageId}`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
