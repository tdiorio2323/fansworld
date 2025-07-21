import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { useEffect, useState } from "react";

// Import pages
import PasswordLanding from "./pages/PasswordLanding";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Discover from "./pages/Discover";
import CreatorProfile from "./pages/CreatorProfile";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import InvitePage from "./pages/InvitePage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { Agency } from "./pages/Agency";
import { CreatorApplication } from "./pages/CreatorApplication";
import { ComingSoon } from "./pages/ComingSoon";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { LinkRedirect } from "./pages/LinkRedirect";
import ReferralProgram from "./pages/ReferralProgram";
import TestPayment from "./pages/TestPayment";
import InstagramHome from "./pages/InstagramHome";
import Create from "./pages/Create";
import AdminTest from "./pages/AdminTest";

const queryClient = new QueryClient();

// Password protection wrapper component
const PasswordProtectedApp = ({ children }: { children: React.ReactNode }) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has valid access
    const checkAccess = () => {
      const access = sessionStorage.getItem("fansworld_access");
      const accessTime = sessionStorage.getItem("fansworld_access_time");
      
      if (access === "granted" && accessTime) {
        // Check if access is still valid (24 hour expiry)
        const accessDate = new Date(accessTime);
        const now = new Date();
        const hoursSinceAccess = (now.getTime() - accessDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceAccess < 24) {
          setHasAccess(true);
        } else {
          // Access expired
          sessionStorage.removeItem("fansworld_access");
          sessionStorage.removeItem("fansworld_access_time");
          setHasAccess(false);
        }
      } else {
        setHasAccess(false);
      }
    };

    checkAccess();
  }, []);

  // Show nothing while checking
  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show password landing if no access
  if (!hasAccess) {
    return <PasswordLanding />;
  }

  // Show app if has access
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Password Landing - Always Accessible */}
            <Route path="/landing" element={<PasswordLanding />} />
            
            {/* All routes now accessible without password */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<InstagramHome />} />
            <Route path="/home-classic" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/search" element={<Discover />} />
            <Route path="/create" element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            } />
            <Route path="/creator/:username" element={<CreatorProfile />} />
            <Route path="/invite/:inviteCode" element={<InvitePage />} />
            <Route path="/agency" element={<Agency />} />
            <Route path="/creator-application" element={
              <ProtectedRoute>
                <CreatorApplication />
              </ProtectedRoute>
            } />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/l/:shortCode" element={<LinkRedirect />} />
            <Route path="/vip/:shortCode" element={<LinkRedirect />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/referrals" element={
              <ProtectedRoute>
                <ReferralProgram />
              </ProtectedRoute>
            } />
            <Route path="/test-payment" element={
              <ProtectedRoute>
                <TestPayment />
              </ProtectedRoute>
            } />
            <Route path="/admin-test" element={<AdminTest />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/billing" element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;