import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Cabana collects and uses your data',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
        <p className="text-[var(--ocean-mist)]">Your privacy and security are our top priorities</p>
      </div>
      
      <div className="glass p-8">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--sunset-gold)]">Our Commitment</h2>
        <p className="text-[var(--ocean-mist)] mb-6">
          This is a placeholder for your privacy policy. Here you will describe what
          personal information you collect, how it's used, and how users can
          exercise their privacy rights.
        </p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Information We Collect</h3>
            <p className="text-[var(--ocean-mist)] text-sm">
              Details on data collection, cookies, and tracking technologies will be outlined here.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">How We Use Your Data</h3>
            <p className="text-[var(--ocean-mist)] text-sm">
              Information about data usage, third-party integrations, and data retention policies.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Your Rights</h3>
            <p className="text-[var(--ocean-mist)] text-sm">
              Details on how users can exercise their privacy rights and contact information for privacy inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}