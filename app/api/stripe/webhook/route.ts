import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminClient } from "@/src/lib/supabase-admin";

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

    if (evt.type === "checkout.session.completed") {
      const session = evt.data.object as Stripe.Checkout.Session;
      const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      const planId = (session.metadata?.plan_id as string | undefined) ?? undefined;
      const userId = (session.metadata?.user_id as string | undefined) ?? undefined;

      if (subId && userId) {
        try {
          const admin = getAdminClient();
          if (admin) {
            let current_period_end: string | null = null;
            try {
              const sub = await stripe.subscriptions.retrieve(subId);
              if (sub.current_period_end) current_period_end = new Date(sub.current_period_end * 1000).toISOString();
            } catch {}

            const { error } = await admin
              .from("subscriptions")
              .upsert(
                [
                  {
                    id: subId,
                    user_id: userId,
                    status: session.payment_status === "paid" ? "active" : session.status ?? "unknown",
                    plan_id: planId ?? "default",
                    current_period_end,
                  },
                ],
                { onConflict: "id" }
              );
            if (error) console.error("Supabase upsert error:", error);
          }
        } catch (e) {
          console.error("Webhook admin handling error:", e);
        }
      }
    }

    return NextResponse.json({ received: true, id: evt.id, type: evt.type });
  } catch (e: any) {
    return new NextResponse(`Webhook Error: ${e.message}`, { status: 400 });
  }
}
