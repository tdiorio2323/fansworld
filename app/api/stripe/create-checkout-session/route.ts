import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 })
  const stripe = new Stripe(key, { apiVersion: "2024-06-20" })

  const origin = req.headers.get("origin") ?? req.nextUrl.origin
  const body = (await req.json().catch(() => ({}))) as {
    priceId?: string
    userId?: string
    mode?: "subscription" | "payment"
  }

  const priceId = body.priceId || process.env.STRIPE_PRICE_ID
  const mode = body.mode || "subscription"
  if (mode === "subscription" && !priceId) {
    return new NextResponse("Missing priceId (set STRIPE_PRICE_ID or pass in body)", { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      ...(mode === "subscription"
        ? { line_items: [{ price: priceId!, quantity: 1 }] }
        : {
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  product_data: { name: "Cabana Access" },
                  unit_amount: 500,
                },
                quantity: 1,
              },
            ],
          }),
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/unlock?canceled=1`,
      metadata: body.userId ? { user_id: body.userId, plan_id: priceId ?? "one_time" } : { plan_id: priceId ?? "one_time" },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return new NextResponse(`Error: ${e.message}`, { status: 400 })
  }
}

