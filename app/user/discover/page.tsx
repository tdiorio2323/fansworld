import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Creators',
  description: 'Browse Cabana creators by category and popularity',
};

export default function DiscoverPage() {
  const categories = ['Fitness', 'Lifestyle', 'Gaming', 'Cooking', 'Music', 'Education'];
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Discover Creators</h1>
      <p className="text-[var(--ocean-mist)]">Find new favourites in a variety of categories.</p>
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <button key={category} className="btn btn-secondary">{category}</button>
        ))}
      </div>
      {/* Placeholder message */}
      <div className="glass p-6 text-center">
        <p className="text-sm text-[var(--ocean-mist)]">Creator discovery coming soon. Stay tuned!</p>
      </div>
    </div>
  );
}