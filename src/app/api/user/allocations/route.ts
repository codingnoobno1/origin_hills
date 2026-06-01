import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Collector email parameter is required." }, { status: 400 });
    }

    const isPlaceholder = 
      !process.env.MONGODB_URI || 
      process.env.MONGODB_URI.includes("YOUR_PASSWORD_HERE") ||
      process.env.MONGODB_URI.includes("abcde");

    if (isPlaceholder) {
      // Sandbox Mock Fallback
      return NextResponse.json({
        success: true,
        isSandbox: true,
        collector: {
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          email: email.toLowerCase(),
          preference: "rare-blends",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          allocationStatus: "Pending Cellar Maturity",
          allocationTins: 1,
          steepingStats: {
            hoursSteeped: 18.5,
            averageTemp: "82°C",
            favoriteVarietal: "Silver Needle White",
            tastingScore: 92
          },
          cellarReserves: [
            { id: "silver-needle", name: "Silver Needle Imperial", category: "White", quantity: 1, reservedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
          ],
          allocationHistory: [
            { title: "Connoisseur Registry Enrollment Requested", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: "completed" },
            { title: "Prerender Slope Coordinates Approved", date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: "completed" },
            { title: "Vintage Cellar Allocation Allotted", date: new Date().toISOString(), status: "active" }
          ]
        }
      });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "origin_hills");
    
    const collector = await db.collection("collectors").findOne({ email: email.toLowerCase() });

    if (!collector) {
      return NextResponse.json({ error: "Collector registry not found." }, { status: 404 });
    }

    // Append simulated relational user statistics for full aesthetic value
    const fullCollector = {
      ...collector,
      steepingStats: {
        hoursSteeped: 32.0,
        averageTemp: "78°C",
        favoriteVarietal: collector.preference === "rare" ? "Silver Needle White" : collector.preference === "rare-blends" ? "Phoenix Cliff Oolong" : "Makaibari First Flush",
        tastingScore: 95
      },
      cellarReserves: [
        { 
          id: collector.preference === "rare" ? "silver-needle" : collector.preference === "rare-blends" ? "phoenix-dancong" : "makaibari-black",
          name: collector.preference === "rare" ? "Silver Needle Imperial" : collector.preference === "rare-blends" ? "Phoenix Cliff Oolong" : "Makaibari First Flush",
          category: collector.preference === "rare" ? "White" : collector.preference === "rare-blends" ? "Oolong" : "Black",
          quantity: collector.allocationTins || 1,
          reservedAt: collector.createdAt 
        }
      ],
      allocationHistory: [
        { title: "Connoisseur Registry Enrollment Requested", date: collector.createdAt, status: "completed" },
        { 
          title: "Prerender Slope Coordinates Approved", 
          date: new Date(new Date(collector.createdAt).getTime() + 12 * 60 * 60 * 1000).toISOString(), 
          status: collector.allocationStatus === "Approved" ? "completed" : "active" 
        },
        { 
          title: "Vintage Cellar Allocation Allotted", 
          date: new Date(new Date(collector.createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString(), 
          status: collector.allocationStatus === "Approved" ? "completed" : "pending" 
        }
      ]
    };

    return NextResponse.json({ success: true, collector: fullCollector });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to fetch collector allocations: ${error.message}` },
      { status: 500 }
    );
  }
}
