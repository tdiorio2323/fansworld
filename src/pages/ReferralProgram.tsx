import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ReferralDashboard } from '@/components/referral/ReferralDashboard';
import Navbar from '@/components/Navbar';
import { useEffect } from 'react';

export default function ReferralProgram() {
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = 'Referral Program - Cabana';
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Referral Program
            </h1>
            <p className="text-lg text-muted-foreground">
              Earn rewards by inviting creators and fans to join Cabana
            </p>
          </div>
          
          <ReferralDashboard />
        </div>
      </main>
    </div>
  );
}