import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore the tools and capabilities that make Cabana unique',
};

export default function FeaturesPage() {
  const features = [
    {
      title: 'Smart Inbox',
      description: 'AI powered message filtering and auto‑reply templates.',
    },
    {
      title: 'Bio Builder',
      description: 'Create a stunning link‑in‑bio page that converts fans into subscribers.',
    },
    {
      title: 'Revenue Analytics',
      description: 'Understand your earnings and identify growth opportunities.',
    },
    {
      title: 'Priority Messaging',
      description: 'Highlight high‑value interactions and respond instantly.',
    },
    {
      title: 'Live Streaming',
      description: 'Stream directly to your fans in high definition with tipping overlays.',
    },
    {
      title: 'Storefront',
      description: 'Sell merchandise or digital products with zero hassle.',
    },
  ];
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Elevate Your Empire</h1>
        <p className="text-[var(--ocean-mist)]">A suite of tools designed to take your creator business to the next level.</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="glass p-6 space-y-3">
            <h3 className="text-xl font-semibold text-[var(--sunset-gold)]">{feature.title}</h3>
            <p className="text-sm text-[var(--ocean-mist)]">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}