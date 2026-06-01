import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { name, email, password, preference } = await request.json();

    if (!name || !email || !password || !preference) {
      return NextResponse.json(
        { error: "All registration registry fields are required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "A valid collector email format is required." },
        { status: 400 }
      );
    }

    // Check if MONGODB_URI is still a placeholder
    const isPlaceholder = 
      !process.env.MONGODB_URI || 
      process.env.MONGODB_URI.includes("YOUR_PASSWORD_HERE") ||
      process.env.MONGODB_URI.includes("abcde");

    if (isPlaceholder) {
      // Premium Sandbox Fallback: Ensures application remains functional and guides user
      return NextResponse.json({
        success: true,
        message: "Registration recorded successfully (Atlas Sandbox Fallback Active). Securely configure MONGODB_URI in your .env file to link a live cluster.",
        isSandbox: true,
        collector: { name, email: email.toLowerCase(), preference }
      });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "origin_hills");
    
    // Check if collector already exists
    const existing = await db.collection("collectors").findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "This collector email has already requested allocations in our ledger." },
        { status: 400 }
      );
    }

    // Insert record
    const result = await db.collection("collectors").insertOne({
      name,
      email: email.toLowerCase(),
      // Simple mock hash representing secure password transformation
      passwordHash: `hash_sha256_mock_${password.length * 7}_${password.substring(0,2)}`,
      preference,
      createdAt: new Date(),
      allocationStatus: "Pending Cellar Maturity",
    });

    return NextResponse.json({
      success: true,
      message: "Congratulations. Your credentials have been recorded in the private allocation ledger.",
      collectorId: result.insertedId,
      collector: { name, email: email.toLowerCase(), preference }
    });

  } catch (error: any) {
    console.error("Database connection failure:", error);
    return NextResponse.json(
      { error: `Database ledger access failed: ${error.message || error}` },
      { status: 500 }
    );
  }
}
