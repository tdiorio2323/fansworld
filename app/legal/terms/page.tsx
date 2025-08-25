import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Cabana legal terms and conditions',
};

export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Terms of Service</h1>
        <p className="text-[var(--ocean-mist)]">Clear guidelines for our premium community</p>
      </div>
      
      <div className="glass p-8">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--sunset-gold)]">Platform Agreement</h2>
        <p className="text-[var(--ocean-mist)] mb-6">
          This placeholder page contains the high-level structure for your Terms of Service.
          Replace this copy with your actual legal terms.
        </p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">User Responsibilities</h3>
            <p className="text-[var(--ocean-mist)] text-sm">
              Outline user responsibilities, content guidelines, and community standards.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Payment Policies</h3>
            <p className="text-[var(--ocean-mist)] text-sm">
              Clear payment terms, subscription policies, and fee structures.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Dispute Resolution</h3>
            <p className="text-[var(--ocean-mist)] text-sm">
              Procedures for handling disputes and compliance with relevant laws and regulations.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.1)]">
          <p className="text-xs text-[var(--ocean-mist)]">
            Always consult with legal counsel to ensure compliance with relevant laws and regulations.
          </p>
        </div>
      </div>
    </div>
  );
}