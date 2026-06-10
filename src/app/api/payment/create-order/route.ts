import { NextResponse } from "next/server";
import { getRazorpayInstance, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt, notes } = body;

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json({ error: "A valid amount is required" }, { status: 400 });
    }

    const amountInPaise = Math.round(numericAmount * 100);
    const orderReceipt = receipt || `oh_receipt_${Date.now()}`;

    if (!isRazorpayConfigured()) {
      return NextResponse.json({
        success: true,
        isSandbox: true,
        keyId: "",
        order: {
          id: `order_sandbox_${Date.now()}`,
          amount: amountInPaise,
          currency,
          receipt: orderReceipt,
          status: "created",
        },
      });
    }

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: orderReceipt,
      notes,
    });

    return NextResponse.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.error?.description || e.message || "Failed to create Razorpay order" }, { status: 500 });
  }
}
