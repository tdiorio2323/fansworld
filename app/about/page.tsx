import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about the Cabana mission and team',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">About Cabana</h1>
        <p className="text-[var(--ocean-mist)]">Where creators become digital royalty</p>
      </div>
      
      <div className="glass p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[var(--sunset-gold)]">Our Mission</h2>
          <p className="text-[var(--ocean-mist)]">
            Cabana is a luxury creator platform built by creators, for creators. We believe
            in empowering digital artists to build sustainable businesses without
            sacrificing creative freedom or personal privacy. Our mission is to
            deliver enterprise-grade tools inside a premium experience, so you can
            focus on what you do best: creating extraordinary content.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[var(--sunset-gold)]">Our Story</h2>
          <p className="text-[var(--ocean-mist)]">
            Founded by a team of technologists and content entrepreneurs, Cabana
            blends cutting-edge AI with meticulous design. From our smart inbox to
            our bio builder, every feature is crafted to elevate your brand and
            streamline your workflow.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--sunset-gold)]">10k+</div>
            <p className="text-sm text-[var(--ocean-mist)]">Active Creators</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--sunset-gold)]">$50M+</div>
            <p className="text-sm text-[var(--ocean-mist)]">Creator Earnings</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--sunset-gold)]">99.9%</div>
            <p className="text-sm text-[var(--ocean-mist)]">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
}