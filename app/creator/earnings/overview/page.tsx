import type { Metadata } from 'next';
import StatsCard from '@/components/ui/stats-card';

export const metadata: Metadata = {
  title: 'Earnings Overview',
  description: 'Track your Cabana revenue and payout history',
};

export default function EarningsOverview() {
  const payouts = [
    { date: '2025-08-01', amount: '$2,500', status: 'Completed' },
    { date: '2025-07-15', amount: '$1,750', status: 'Completed' },
    { date: '2025-07-01', amount: '$2,100', status: 'Completed' },
    { date: '2025-06-15', amount: '$1,900', status: 'Completed' },
  ];
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Earnings Overview</h1>
        <p className="mt-2 text-[var(--ocean-mist)]">Monitor your revenue growth and recent payouts.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Earnings" value="$42,300" change={15.2} />
        <StatsCard title="This Month" value="$8,750" change={9.7} />
        <StatsCard title="Pending Payout" value="$1,200" change={-4.5} />
      </div>
      <div className="glass p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Payouts</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-[var(--ocean-mist)]">
            <tr>
              <th className="py-2">Date</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p, idx) => (
              <tr key={idx} className="border-t border-[rgba(255,255,255,0.1)]">
                <td className="py-2">{p.date}</td>
                <td className="py-2">{p.amount}</td>
                <td className="py-2">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[var(--midnight-navy)] text-[var(--sunset-gold)]">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}