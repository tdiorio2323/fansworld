import type { Metadata } from 'next';
import StatsCard from '@/components/ui/stats-card';

export const metadata: Metadata = {
  title: 'Earnings Analytics',
  description: 'Deep dive into your revenue streams on Cabana',
};

export default function EarningsAnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Earnings Analytics</h1>
        <p className="mt-2 text-[var(--ocean-mist)]">Break down your income by source and track trends over time.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Subscriptions" value="$32,500" change={10.2} />
        <StatsCard title="Tips" value="$6,200" change={4.7} />
        <StatsCard title="Store" value="$3,600" change={-1.2} />
      </div>
      <div className="glass p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold mb-1">Subscriptions</h3>
            <p className="text-sm text-[var(--ocean-mist)]">65% of total revenue</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Tips</h3>
            <p className="text-sm text-[var(--ocean-mist)]">20% of total revenue</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Store</h3>
            <p className="text-sm text-[var(--ocean-mist)]">15% of total revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}