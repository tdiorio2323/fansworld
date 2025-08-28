"use client"

export default function Page() {
  const startCheckout = async () => {
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    })
    if (!res.ok) {
      const msg = await res.text()
      alert(`Checkout error: ${msg}`)
      return
    }
    const data = (await res.json()) as { url?: string }
    if (data.url) window.location.href = data.url
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Unlock</h1>
      <p className="mt-2 text-sm text-gray-600">Start Stripe Checkout</p>
      <button
        onClick={startCheckout}
        className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
      >
        Continue to Checkout
      </button>
      <p className="mt-3 text-xs text-gray-500">
        Requires STRIPE_SECRET_KEY and either STRIPE_PRICE_ID (for subscriptions) or uses a $5 one-time checkout.
      </p>
    </main>
  )
}
