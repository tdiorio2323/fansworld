import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Subscriptions',
  description: 'Manage the creators you follow on Cabana',
};

interface Subscription {
  id: number;
  creator: string;
  avatar: string;
  tier: string;
  nextBillingDate: string;
}

const subs: Subscription[] = [
  { id: 1, creator: 'Sophia Luxe', avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=80&q=80', tier: 'Gold', nextBillingDate: '2025-09-01' },
  { id: 2, creator: 'Leo Royale', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80', tier: 'Silver', nextBillingDate: '2025-08-20' },
];

export default function SubscriptionsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">My Subscriptions</h1>
      <p className="text-[var(--ocean-mist)]">Here are the creators you currently support.</p>
      <div className="space-y-4">
        {subs.map((sub) => (
          <div key={sub.id} className="glass p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={sub.avatar} alt={sub.creator} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold">{sub.creator}</h3>
                <p className="text-xs text-[var(--ocean-mist)]">{sub.tier} tier · Next bill {sub.nextBillingDate}</p>
              </div>
            </div>
            <button className="btn btn-secondary text-xs">Cancel</button>
          </div>
        ))}
      </div>
    </div>
  );
}