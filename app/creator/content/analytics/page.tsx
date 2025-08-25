import type { Metadata } from 'next';
import StatsCard from '@/components/ui/stats-card';

export const metadata: Metadata = {
  title: 'Content Analytics',
  description: 'Analyse performance of your posts and media',
};

export default function ContentAnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Content Analytics</h1>
        <p className="mt-2 text-[var(--ocean-mist)]">See how your posts resonate with your audience.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Views" value="12,345" change={7.8} />
        <StatsCard title="Likes" value="2,345" change={12.1} />
        <StatsCard title="Comments" value="456" change={-3.5} />
      </div>
      <div className="glass p-6">
        <h2 className="text-xl font-semibold mb-4">Top Performing Posts</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-[var(--ocean-mist)]">
            <tr>
              <th className="py-2">Title</th>
              <th className="py-2">Views</th>
              <th className="py-2">Likes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[rgba(255,255,255,0.1)]">
              <td className="py-2">Morning Yoga Routine</td>
              <td className="py-2">4,500</td>
              <td className="py-2">780</td>
            </tr>
            <tr className="border-t border-[rgba(255,255,255,0.1)]">
              <td className="py-2">Beach Photoshoot</td>
              <td className="py-2">3,200</td>
              <td className="py-2">650</td>
            </tr>
            <tr className="border-t border-[rgba(255,255,255,0.1)]">
              <td className="py-2">Live Q&A</td>
              <td className="py-2">2,700</td>
              <td className="py-2">530</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}