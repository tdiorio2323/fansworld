import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payouts',
  description: 'View your completed and upcoming Cabana payouts',
};

const payouts = [
  { id: 1, date: '2025-08-15', amount: '$2,500', status: 'Scheduled' },
  { id: 2, date: '2025-08-01', amount: '$2,700', status: 'Completed' },
  { id: 3, date: '2025-07-15', amount: '$1,750', status: 'Completed' },
  { id: 4, date: '2025-07-01', amount: '$2,100', status: 'Completed' },
];

export default function PayoutsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Payouts</h1>
        <p className="mt-2 text-[var(--ocean-mist)]">Stay up to date on your payment schedule and history.</p>
      </div>
      <div className="glass p-6">
        <table className="w-full text-left text-sm">
          <thead className="text-[var(--ocean-mist)]">
            <tr>
              <th className="py-2">Date</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-t border-[rgba(255,255,255,0.1)]">
                <td className="py-2">{p.date}</td>
                <td className="py-2">{p.amount}</td>
                <td className="py-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${p.status === 'Completed' ? 'bg-[var(--midnight-navy)] text-[var(--sunset-gold)]' : 'bg-yellow-700 text-yellow-200'}`}>
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