import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET() {
  try {
    if (isSandboxMode()) {
      return NextResponse.json({
        success: true,
        isSandbox: true,
        analytics: {
          totalCollectors: 3, totalOrders: 2, totalRevenue: 150,
          pendingOrders: 1, approvedAllocations: 1,
          topProducts: [{ name: "Silver Needle Imperial", orders: 2 }],
          recentSignups: 3, newsletterSubscribers: 12,
        },
      });
    }

    const db = await getDb();
    const [collectors, orders, newsletter] = await Promise.all([
      db.collection("collectors").countDocuments(),
      db.collection("orders").find({}).toArray(),
      db.collection("newsletter").countDocuments(),
    ]);

    const totalRevenue = orders.reduce((acc: number, o: any) => acc + (o.total || 0), 0);
    const pendingOrders = orders.filter((o: any) => o.status?.toLowerCase().includes("pending")).length;

    // Top products by order count
    const productCounts: Record<string, number> = {};
    orders.forEach((o: any) => {
      (o.items || []).forEach((item: any) => {
        productCounts[item.name] = (productCounts[item.name] || 0) + item.qty;
      });
    });
    const topProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, orders]) => ({ name, orders }));

    return NextResponse.json({
      success: true,
      analytics: { totalCollectors: collectors, totalOrders: orders.length, totalRevenue, pendingOrders, topProducts, newsletterSubscribers: newsletter },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
