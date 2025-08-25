import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Guidelines',
  description: 'Rules and standards for the Cabana community',
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold">Community Guidelines</h1>
      <p className="text-[var(--ocean-mist)]">
        Use this page to outline the behaviour expected of both creators and fans
        on Cabana. Provide clear examples of acceptable and prohibited content,
        consequences for violations, and guidance on reporting issues. A strong
        set of guidelines fosters a safe and respectful environment for all.
      </p>
    </div>
  );
}