import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { AccessibilityProvider } from "./components/AccessibilityProvider";
import ExitIntent from "./components/ExitIntent";
import { performanceMonitor } from "./lib/performance";


// Import pages - COMPREHENSIVE VERSION
// Core Pages
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { EnhancedUIDemo } from "./pages/EnhancedUIDemo";
import AuthCallback from "./pages/AuthCallback";
import SimpleAuthCallback from "./components/SimpleAuthCallback";
import Discover from "./pages/Discover";
import CreatorProfile from "./pages/CreatorProfile";
import Messages from "./pages/Messages";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { Agency } from "./pages/Agency";
import { CreatorApplication } from "./pages/CreatorApplication";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { DemoAnalyticsDashboard } from "./pages/DemoAnalyticsDashboard";
import ReferralProgram from "./pages/ReferralProgram";
import VipEntry from "./pages/VipEntry";
import Reels from "./pages/Reels";
import LandingPage from "./pages/LandingPage";
import SimpleVipEntry from "./pages/SimpleVipEntry";
import TestPage from "./pages/TestPage";
import Feed from "./pages/Feed";
import CreatorDashboard from "./pages/CreatorDashboard";
import ContentManager from "./pages/ContentManager";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import PaymentSuccess from "./pages/PaymentSuccess";
import LuxuryThemeDemo from "./pages/LuxuryThemeDemo";

// Public Pages
import AboutPage from "./pages/public/AboutPage";
import FeaturesPage from "./pages/public/FeaturesPage";
import PricingPage from "./pages/public/PricingPage";

// Auth Pages  
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Legal Pages
import TermsOfServicePage from "./pages/legal/TermsOfServicePage";

// Support Pages
import HelpCenterPage from "./pages/support/help/HelpCenterPage";

// Forum Pages
import ForumCategoriesPage from "./pages/forum/categories/ForumCategoriesPage";

// Creator Dashboard Pages
import CreatorDashboardOverview from "./pages/creator/dashboard/CreatorDashboardOverview";
import CreatorAnalyticsPage from "./pages/creator/analytics/CreatorAnalyticsPage";
import CreatorToolsPage from "./pages/creator/tools/CreatorToolsPage";
import CreatorContentPage from "./pages/creator/content/CreatorContentPage";
import CreatorEarningsPage from "./pages/creator/earnings/CreatorEarningsPage";
import CreatorFansPage from "./pages/creator/fans/CreatorFansPage";

// Error Pages
import NotFoundPage from "./pages/errors/NotFoundPage";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Homepage */}
        <Route path="/" element={<HomePage />} />
        <Route path="/SimpleVipEntry" element={<SimpleVipEntry />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/ui-demo" element={<EnhancedUIDemo />} />
        <Route path="/vip" element={<VipEntry />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/auth/callback" element={<SimpleAuthCallback />} />
        <Route path="/AuthCallback" element={<SimpleAuthCallback />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/reels" element={
          <ProtectedRoute>
            <Reels />
          </ProtectedRoute>
        } />
        <Route path="/creator/:username" element={<CreatorProfile />} />
        <Route path="/agency" element={<Agency />} />
        <Route path="/creator-application" element={
          <ProtectedRoute>
            <CreatorApplication />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/AnalyticsDashboard" element={<AnalyticsDashboard />} />
        <Route path="/referrals" element={
          <ProtectedRoute>
            <ReferralProgram />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/creator-dashboard" element={
          <ProtectedRoute>
            <CreatorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/content-manager" element={
          <ProtectedRoute>
            <ContentManager />
          </ProtectedRoute>
        } />
        <Route path="/subscription-plans" element={<SubscriptionPlans />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/Messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } />
        <Route path="/Billing" element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/Settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        {/* Public Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/forum" element={<ForumCategoriesPage />} />
        <Route path="/luxury-demo" element={<LuxuryThemeDemo />} />
        
        {/* Creator Dashboard Overview */}
        <Route path="/creator/dashboard" element={
          <ProtectedRoute>
            <CreatorDashboardOverview />
          </ProtectedRoute>
        } />
        
        {/* Creator Management Pages */}
        <Route path="/creator/analytics" element={
          <ProtectedRoute>
            <CreatorAnalyticsPage />
          </ProtectedRoute>
        } />
        <Route path="/creator/tools" element={
          <ProtectedRoute>
            <CreatorToolsPage />
          </ProtectedRoute>
        } />
        <Route path="/creator/content" element={
          <ProtectedRoute>
            <CreatorContentPage />
          </ProtectedRoute>
        } />
        <Route path="/creator/earnings" element={
          <ProtectedRoute>
            <CreatorEarningsPage />
          </ProtectedRoute>
        } />
        <Route path="/creator/fans" element={
          <ProtectedRoute>
            <CreatorFansPage />
          </ProtectedRoute>
        } />
        
        {/* Homepage route */}
        <Route path="/home" element={<HomePage />} />
        
        {/* 404 - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  // Initialize performance monitoring
  React.useEffect(() => {
    performanceMonitor.markFeatureUsage('app_startup');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <AuthProvider>
          <TooltipProvider>
            <div>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <main id="main-content">
                  <AppRoutes />
                </main>
                <ExitIntent />
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;