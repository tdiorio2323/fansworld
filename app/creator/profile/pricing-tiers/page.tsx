import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Tiers',
  description: 'Set your subscription prices and benefits',
};

export default function PricingTiersPage() {
  const tiers = [
    { name: 'Bronze', price: 'Free', benefits: 'Fans can follow for updates' },
    { name: 'Silver', price: '$10/month', benefits: 'Access to photos and messages' },
    { name: 'Gold', price: '$25/month', benefits: 'Full content access and bonus perks' },
  ];
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Subscription Pricing</h1>
      <p className="text-[var(--ocean-mist)]">Adjust your subscription tiers to reflect the value you provide.</p>
      <div className="grid gap-6 sm:grid-cols-2">
        {tiers.map((tier) => (
          <div key={tier.name} className="glass p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[var(--sunset-gold)]">{tier.name}</h2>
            <p className="text-2xl font-bold">{tier.price}</p>
            <p className="text-sm text-[var(--ocean-mist)]">{tier.benefits}</p>
            <div>
              <label htmlFor={`price-${tier.name}`} className="block text-xs mb-1">Custom Price</label>
              <input id={`price-${tier.name}`} type="text" placeholder="e.g. $15/month" className="w-full glass px-3 py-2" />
            </div>
            <button className="btn btn-secondary w-full text-sm">Save Tier</button>
          </div>
        ))}
      </div>
    </div>
  );
}