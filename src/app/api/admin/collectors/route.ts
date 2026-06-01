import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: Retrieve all collectors
export async function GET() {
  try {
    const isPlaceholder = 
      !process.env.MONGODB_URI || 
      process.env.MONGODB_URI.includes("YOUR_PASSWORD_HERE") ||
      process.env.MONGODB_URI.includes("abcde");

    if (isPlaceholder) {
      // Sandbox Mock Data Fallback
      return NextResponse.json({
        isSandbox: true,
        collectors: [
          {
            _id: "mock_1",
            name: "Alistair Vance",
            email: "alistair@vance.com",
            preference: "rare",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            allocationStatus: "Approved",
            allocationTins: 3,
          },
          {
            _id: "mock_2",
            name: "Charlotte Sterling",
            email: "charlotte@sterling.com",
            preference: "rare-blends",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            allocationStatus: "Pending Cellar Maturity",
            allocationTins: 2,
          },
          {
            _id: "mock_3",
            name: "Kenzo Takahashi",
            email: "kenzo@takahashi.co.jp",
            preference: "black",
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            allocationStatus: "Pending Cellar Maturity",
            allocationTins: 1,
          }
        ]
      });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "origin_hills");
    const collectors = await db
      .collection("collectors")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, collectors });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to fetch collectors ledger: ${error.message}` },
      { status: 500 }
    );
  }
}

// PATCH: Update collector status or allocations
export async function PATCH(request: Request) {
  try {
    const { id, status, tins } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Collector ID is required." }, { status: 400 });
    }

    const isPlaceholder = 
      !process.env.MONGODB_URI || 
      process.env.MONGODB_URI.includes("YOUR_PASSWORD_HERE") ||
      process.env.MONGODB_URI.includes("abcde");

    if (isPlaceholder) {
      // Sandbox Success Fallback
      return NextResponse.json({
        success: true,
        message: "Sandbox Allocation Updated Successfully.",
        isSandbox: true
      });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "origin_hills");

    const updateFields: any = {};
    if (status !== undefined) updateFields.allocationStatus = status;
    if (tins !== undefined) updateFields.allocationTins = Number(tins);

    // Parse ID
    let queryId: string | ObjectId = id;
    try {
      if (ObjectId.isValid(id)) {
        queryId = new ObjectId(id);
      }
    } catch (e) {
      // Fallback to string search
    }

    const result = await db.collection("collectors").updateOne(
      { _id: queryId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      // Try with string id directly
      const resultString = await db.collection("collectors").updateOne(
        { _id: String(id) },
        { $set: updateFields }
      );
      if (resultString.matchedCount === 0) {
        return NextResponse.json({ error: "Collector not found in database." }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, message: "Ledger entry updated successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to update ledger: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST: Seed mock data to database
export async function POST() {
  try {
    const isPlaceholder = 
      !process.env.MONGODB_URI || 
      process.env.MONGODB_URI.includes("YOUR_PASSWORD_HERE") ||
      process.env.MONGODB_URI.includes("abcde");

    if (isPlaceholder) {
      return NextResponse.json({
        success: true,
        message: "Sandbox environment initialized. Seeding mock variables.",
        isSandbox: true
      });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "origin_hills");

    // Clean up existing mock runs if necessary, then insert
    const seedData = [
      {
        name: "Alistair Vance",
        email: "alistair@vance.com",
        passwordHash: "hash_sha256_mock_vance",
        preference: "rare",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        allocationStatus: "Approved",
        allocationTins: 3,
      },
      {
        name: "Charlotte Sterling",
        email: "charlotte@sterling.com",
        passwordHash: "hash_sha256_mock_sterling",
        preference: "rare-blends",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        allocationStatus: "Pending Cellar Maturity",
        allocationTins: 2,
      },
      {
        name: "Kenzo Takahashi",
        email: "kenzo@takahashi.co.jp",
        passwordHash: "hash_sha256_mock_takahashi",
        preference: "black",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        allocationStatus: "Pending Cellar Maturity",
        allocationTins: 1,
      }
    ];

    // Check duplicates before inserting seeds
    for (const collector of seedData) {
      const match = await db.collection("collectors").findOne({ email: collector.email });
      if (!match) {
        await db.collection("collectors").insertOne(collector);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Collectors ledger successfully seeded with grand-cru reserves data."
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Database seeding failed: ${error.message}` },
      { status: 500 }
    );
  }
}
