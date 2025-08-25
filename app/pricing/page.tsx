import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent, creator‑friendly pricing for Cabana',
};

export default function PricingPage() {
  const tiers = [
    {
      name: 'Starter',
      description: 'Perfect for newcomers building their empire',
      price: '$0 fees',
      details: ['0% platform fee up to $10k/month', 'All creator tools included', '24/7 support'],
    },
    {
      name: 'Growth',
      description: 'For scaling creators who have found their audience',
      price: '5% fee',
      details: ['Platform fee after your first $10k/month', 'Premium analytics', 'Early access to new features'],
    },
    {
      name: 'Elite',
      description: 'For six‑figure earners and professional brands',
      price: 'Custom',
      details: ['Dedicated success manager', 'Priority support', 'Bespoke partnerships'],
    },
  ];
  return (
    <section className="max-w-6xl mx-auto py-20 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold">Simple & Transparent Pricing</h1>
        <p className="text-[var(--ocean-mist)] max-w-2xl mx-auto">
          We’re on your team. You keep 100% of your earnings until you surpass $10,000 per month. No hidden fees, no surprises.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.name} className="glass p-8 flex flex-col">
            <h3 className="text-2xl font-semibold mb-2 text-[var(--sunset-gold)]">{tier.name}</h3>
            <p className="text-[var(--ocean-mist)] mb-6">{tier.description}</p>
            <div className="text-4xl font-bold mb-6">{tier.price}</div>
            <ul className="flex-1 space-y-2 text-sm">
              {tier.details.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-[var(--sunset-gold)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="mt-8 btn btn-primary w-full text-base">Get started</button>
          </div>
        ))}
      </div>
    </section>
  );
}