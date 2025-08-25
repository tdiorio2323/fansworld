import type { Metadata } from 'next';
import StatsCard from '@/components/ui/stats-card';

export const metadata: Metadata = {
  title: 'Creator Dashboard',
  description: 'Overview of your Cabana creator performance',
};

export default function CreatorDashboard() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Dashboard Overview</h1>
        <p className="mt-2 text-[var(--ocean-mist)]">Your performance at a glance.</p>
      </div>
      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Monthly Earnings" value="$7,850" change={12.4} />
        <StatsCard title="Subscribers" value="1,238" change={-2.1} />
        <StatsCard title="Messages" value="87" change={5.3} />
        <StatsCard title="New Posts" value="14" change={8.9} />
      </div>
      {/* Placeholder analytics chart */}
      <div className="glass p-6">
        <h2 className="text-xl font-semibold mb-4">Earnings Trend</h2>
        <div className="h-64 flex items-end space-x-2">
          {/* Simple bar chart representation */}
          {['Jan','Feb','Mar','Apr','May','Jun','Jul'].map((label, idx) => {
            const heights = [40, 65, 50, 90, 70, 80, 95];
            return (
              <div key={label} className="flex flex-col items-center flex-1">
                <div
                  className="w-6 rounded-t-md bg-[var(--sunset-gold)]"
                  style={{ height: `${heights[idx]}%`, minHeight: '4rem' }}
                />
                <span className="mt-2 text-xs text-[var(--ocean-mist)]">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}