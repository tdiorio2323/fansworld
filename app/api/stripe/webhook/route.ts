import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });
  const buf = Buffer.from(await req.arrayBuffer());
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) return new NextResponse("Missing Stripe env", { status: 500 });
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  try {
    const evt = stripe.webhooks.constructEvent(buf, sig, secret);
    return NextResponse.json({ received: true, id: evt.id, type: evt.type });
  } catch (e: any) {
    return new NextResponse(`Webhook Error: ${e.message}`, { status: 400 });
  }
}
