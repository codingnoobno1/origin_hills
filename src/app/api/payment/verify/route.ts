import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb, isSandboxMode } from "@/lib/mongodb";
import { isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userEmail,
      items,
      total,
      note,
    } = body;

    if (!items || total === undefined) {
      return NextResponse.json({ error: "items and total are required" }, { status: 400 });
    }

    if (isRazorpayConfigured()) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ success: false, error: "Missing payment verification fields" }, { status: 400 });
      }

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ success: false, error: "Payment signature verification failed" }, { status: 400 });
      }
    }

    const order = {
      userEmail: userEmail || "guest",
      items,
      total: Number(total),
      note,
      status: "Confirmed",
      paymentMethod: "razorpay",
      paymentId: razorpay_payment_id || null,
      razorpayOrderId: razorpay_order_id || null,
      createdAt: new Date().toISOString(),
    };

    if (isSandboxMode()) {
      return NextResponse.json({ success: true, order: { _id: "sandbox_order", ...order }, isSandbox: true }, { status: 201 });
    }

    const db = await getDb();
    const result = await db.collection("orders").insertOne(order);
    return NextResponse.json({ success: true, order: { _id: result.insertedId, ...order } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
