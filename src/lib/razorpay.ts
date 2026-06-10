import Razorpay from "razorpay";

export function isRazorpayConfigured(): boolean {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return !!id && !!secret && !id.startsWith("YOUR_") && !secret.startsWith("YOUR_");
}

let instance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay {
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
  }
  return instance;
}
