import { NextResponse } from "next/server";
import { getDb, isSandboxMode } from "@/lib/mongodb";

export async function GET() {
  try {
    if (isSandboxMode()) {
      return NextResponse.json({
        status: "success", isSandbox: true,
        data: {
          totalCollectors: 3, totalOrders: 2, totalRevenue: 150,
          pendingOrders: 1, newsletterSubscribers: 12, totalProducts: 4,
          recentOrders: [{ id: "order_001", userEmail: "alistair@vance.com", total: 96, status: "Confirmed" }],
          topProducts: [{ name: "Silver Needle Imperial", orders: 2 }],
        },
      });
    }
    const db = await getDb();
    const [collectors, orders, newsletter, products] = await Promise.all([
      db.collection("collectors").countDocuments(),
      db.collection("orders").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("newsletter").countDocuments(),
      db.collection("products").countDocuments({ active: true }),
    ]);
    const totalRevenue = orders.reduce((a: number, o: any) => a + (o.total || 0), 0);
    const pendingOrders = orders.filter((o: any) => o.status?.toLowerCase().includes("pending")).length;
    return NextResponse.json({
      status: "success",
      data: { totalCollectors: collectors, totalOrders: orders.length, totalRevenue, pendingOrders, newsletterSubscribers: newsletter, totalProducts: products, recentOrders: orders.slice(0, 5).map((o: any) => ({ ...o, id: o._id?.toString() })) },
    });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
