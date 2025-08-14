import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";

// Import pages - CLEAN VERSION (only existing pages)
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
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

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Simple Home as Homepage */}
            {/* CLEAN ROUTES - Only existing pages */}
            <Route path="/" element={<SimpleVipEntry />} />
            <Route path="/SimpleVipEntry" element={<SimpleVipEntry />} />
            <Route path="/test" element={<TestPage />} />
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
