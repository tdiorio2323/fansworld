import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
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
import { HTMLGenerator } from "./pages/HTMLGenerator";
import { ComingSoon } from "./pages/ComingSoon";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { LinkRedirect } from "./pages/LinkRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/search" element={<Discover />} />
            <Route path="/creator/:username" element={<CreatorProfile />} />
            <Route path="/invite/:inviteCode" element={<InvitePage />} />
            <Route path="/agency" element={<Agency />} />
            <Route path="/creator-application" element={
              <ProtectedRoute>
                <CreatorApplication />
              </ProtectedRoute>
            } />
            <Route path="/html-generator" element={<HTMLGenerator />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/l/:shortCode" element={<LinkRedirect />} />
            <Route path="/vip/:shortCode" element={<LinkRedirect />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
