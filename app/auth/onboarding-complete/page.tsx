import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Welcome to Cabana',
  description: 'Your creator onboarding is complete',
};

export default function OnboardingCompletePage() {
  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      <h1 className="text-3xl font-bold">Welcome aboard!</h1>
      <p className="text-[var(--ocean-mist)]">
        Your profile is now active. Explore your dashboard, upload your first
        post and start engaging with your community.
      </p>
      <Link href="/creator/dashboard" className="btn btn-primary inline-block">Go to dashboard</Link>
    </div>
  );
}