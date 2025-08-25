import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Guide',
  description: 'Tips and best practices for Cabana creators',
};

export default function CreatorGuidePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Creator Guide</h1>
      <p className="text-[var(--ocean-mist)]">
        Welcome to Cabana! This guide is a living document of best practices,
        marketing strategies and platform tips to help you grow your brand.
      </p>
      <div className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">1. Optimise Your Profile</h2>
        <p className="text-sm text-[var(--ocean-mist)]">
          Use a high‑resolution avatar, craft a captivating bio and set your
          pricing tiers thoughtfully. Your profile is your storefront – make it
          shine.
        </p>
      </div>
      <div className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">2. Engage Consistently</h2>
        <p className="text-sm text-[var(--ocean-mist)]">
          Regular posts, stories and direct messages keep your audience
          engaged. Leverage our smart inbox to prioritise high‑value fans.
        </p>
      </div>
      <div className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">3. Analyse & Adapt</h2>
        <p className="text-sm text-[var(--ocean-mist)]">
          Review your analytics dashboard weekly. Identify what content performs
          best and double down on what resonates with your audience.
        </p>
      </div>
    </div>
  );
}