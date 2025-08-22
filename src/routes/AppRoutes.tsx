import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Layout Components
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import CreatorLayout from '@/components/layout/CreatorLayout'
import AdminLayout from '@/components/layout/AdminLayout'

// Public Pages
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/public/AboutPage'
import FeaturesPage from '@/pages/public/FeaturesPage'
import PricingPage from '@/pages/public/PricingPage'
import BlogPage from '@/pages/public/BlogPage'
import ContactPage from '@/pages/public/ContactPage'
import CareersPage from '@/pages/public/CareersPage'
import PressPage from '@/pages/public/PressPage'
import InvestorsPage from '@/pages/public/InvestorsPage'

// Authentication Pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import TwoFactorPage from '@/pages/auth/TwoFactorPage'
import SocialCallbackPage from '@/pages/auth/SocialCallbackPage'

// Creator Dashboard Pages
import CreatorDashboardOverview from '@/pages/creator/dashboard/CreatorDashboardOverview'
import CreatorAnalytics from '@/pages/creator/analytics/CreatorAnalytics'
import CreatorEarnings from '@/pages/creator/earnings/CreatorEarnings'
import ContentManager from '@/pages/creator/content/ContentManager'
import ContentUpload from '@/pages/creator/content/ContentUpload'
import ContentScheduler from '@/pages/creator/content/ContentScheduler'
import FanManagement from '@/pages/creator/fans/FanManagement'
import CreatorMessaging from '@/pages/creator/messaging/CreatorMessaging'
import CreatorSettings from '@/pages/creator/settings/CreatorSettings'
import CreatorTools from '@/pages/creator/tools/CreatorTools'

// User Pages
import UserProfile from '@/pages/user/profile/UserProfile'
import UserSettings from '@/pages/user/settings/UserSettings'
import UserSubscriptions from '@/pages/user/subscriptions/UserSubscriptions'
import UserFavorites from '@/pages/user/favorites/UserFavorites'
import UserHistory from '@/pages/user/history/UserHistory'
import UserNotifications from '@/pages/user/notifications/UserNotifications'

// Admin Pages
import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard'
import AdminUsers from '@/pages/admin/users/AdminUsers'
import AdminCreators from '@/pages/admin/creators/AdminCreators'
import AdminContent from '@/pages/admin/content/AdminContent'
import AdminPayments from '@/pages/admin/payments/AdminPayments'
import AdminAnalytics from '@/pages/admin/analytics/AdminAnalytics'
import AdminReports from '@/pages/admin/reports/AdminReports'
import AdminSettings from '@/pages/admin/settings/AdminSettings'
import AdminSystem from '@/pages/admin/system/AdminSystem'

// Forum Pages
import ForumCategoriesPage from '@/pages/forum/categories/ForumCategoriesPage'
import ForumTopics from '@/pages/forum/topics/ForumTopics'
import ForumPosts from '@/pages/forum/posts/ForumPosts'
import ForumModeration from '@/pages/forum/moderation/ForumModeration'
import ForumSearch from '@/pages/forum/search/ForumSearch'

// Community Pages
import CommunityGroups from '@/pages/community/groups/CommunityGroups'
import CommunityEvents from '@/pages/community/events/CommunityEvents'
import CommunityChallenges from '@/pages/community/challenges/CommunityChallenges'
import CommunityLeaderboards from '@/pages/community/leaderboards/CommunityLeaderboards'
import CommunityAchievements from '@/pages/community/achievements/CommunityAchievements'

// Legal Pages
import TermsOfServicePage from '@/pages/legal/TermsOfServicePage'
import PrivacyPolicyPage from '@/pages/legal/PrivacyPolicyPage'
import DMCAPage from '@/pages/legal/DMCAPage'
import CompliancePage from '@/pages/legal/CompliancePage'
import CookiePolicyPage from '@/pages/legal/CookiePolicyPage'

// Support Pages
import HelpCenterPage from '@/pages/support/help/HelpCenterPage'
import FAQPage from '@/pages/support/faq/FAQPage'
import ContactSupportPage from '@/pages/support/contact/ContactSupportPage'
import SupportTickets from '@/pages/support/tickets/SupportTickets'
import GuidesPage from '@/pages/support/guides/GuidesPage'
import TutorialsPage from '@/pages/support/tutorials/TutorialsPage'
import TroubleshootingPage from '@/pages/support/troubleshooting/TroubleshootingPage'

// Marketing Pages
import LandingPages from '@/pages/marketing/landing/LandingPages'
import CampaignsPage from '@/pages/marketing/campaigns/CampaignsPage'
import ReferralsPage from '@/pages/marketing/referrals/ReferralsPage'
import AffiliatesPage from '@/pages/marketing/affiliates/AffiliatesPage'
import PartnershipsPage from '@/pages/marketing/partnerships/PartnershipsPage'
import PromotionsPage from '@/pages/marketing/promotions/PromotionsPage'

// Error Pages
import NotFoundPage from '@/pages/errors/NotFoundPage'
import ServerErrorPage from '@/pages/errors/ServerErrorPage'
import ForbiddenPage from '@/pages/errors/ForbiddenPage'
import MaintenancePage from '@/pages/errors/MaintenancePage'
import OfflinePage from '@/pages/errors/OfflinePage'

// Mobile Pages
import MobileAppPage from '@/pages/mobile/app/MobileAppPage'
import ResponsivePage from '@/pages/mobile/responsive/ResponsivePage'

// SEO Pages
import SitemapPage from '@/pages/seo/sitemap/SitemapPage'
import RobotsPage from '@/pages/seo/robots/RobotsPage'

// Campaign Pages
import SeasonalCampaigns from '@/pages/campaigns/seasonal/SeasonalCampaigns'
import EventCampaigns from '@/pages/campaigns/events/EventCampaigns'
import PartnershipCampaigns from '@/pages/campaigns/partnerships/PartnershipCampaigns'

// Analytics Pages
import TrackingPage from '@/pages/analytics/tracking/TrackingPage'
import ReportsPage from '@/pages/analytics/reports/ReportsPage'
import InsightsPage from '@/pages/analytics/insights/InsightsPage'

// Discovery and Browse Pages
import DiscoverPage from '@/pages/DiscoverPage'
import CategoriesPage from '@/pages/CategoriesPage'
import CreatorProfilePage from '@/pages/CreatorProfilePage'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="careers" element={<CareersPage />} />
        <Route path="press" element={<PressPage />} />
        <Route path="investors" element={<InvestorsPage />} />
        
        {/* Discovery */}
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="creator/:username" element={<CreatorProfilePage />} />
      </Route>

      {/* Authentication Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="two-factor" element={<TwoFactorPage />} />
        <Route path="callback/:provider" element={<SocialCallbackPage />} />
      </Route>

      {/* Creator Dashboard Routes */}
      <Route path="/creator" element={<CreatorLayout />}>
        <Route index element={<CreatorDashboardOverview />} />
        <Route path="dashboard" element={<CreatorDashboardOverview />} />
        
        {/* Analytics */}
        <Route path="analytics" element={<CreatorAnalytics />} />
        <Route path="analytics/:timeframe" element={<CreatorAnalytics />} />
        
        {/* Earnings */}
        <Route path="earnings" element={<CreatorEarnings />} />
        <Route path="earnings/history" element={<CreatorEarnings />} />
        <Route path="earnings/taxes" element={<CreatorEarnings />} />
        
        {/* Content Management */}
        <Route path="content" element={<ContentManager />} />
        <Route path="content/new" element={<ContentUpload />} />
        <Route path="content/edit/:id" element={<ContentUpload />} />
        <Route path="content/scheduler" element={<ContentScheduler />} />
        
        {/* Fan Management */}
        <Route path="fans" element={<FanManagement />} />
        <Route path="fans/analytics" element={<FanManagement />} />
        <Route path="fans/tiers" element={<FanManagement />} />
        
        {/* Messaging */}
        <Route path="messaging" element={<CreatorMessaging />} />
        <Route path="messaging/:conversationId" element={<CreatorMessaging />} />
        
        {/* Settings */}
        <Route path="settings" element={<CreatorSettings />} />
        <Route path="settings/:section" element={<CreatorSettings />} />
        
        {/* Tools */}
        <Route path="tools" element={<CreatorTools />} />
        <Route path="tools/:toolName" element={<CreatorTools />} />
      </Route>

      {/* User Account Routes */}
      <Route path="/user" element={<MainLayout />}>
        <Route path="profile" element={<UserProfile />} />
        <Route path="profile/edit" element={<UserProfile />} />
        <Route path="settings" element={<UserSettings />} />
        <Route path="subscriptions" element={<UserSubscriptions />} />
        <Route path="favorites" element={<UserFavorites />} />
        <Route path="history" element={<UserHistory />} />
        <Route path="notifications" element={<UserNotifications />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:userId" element={<AdminUsers />} />
        <Route path="creators" element={<AdminCreators />} />
        <Route path="creators/:creatorId" element={<AdminCreators />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="content/moderation" element={<AdminContent />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="payments/disputes" element={<AdminPayments />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="system" element={<AdminSystem />} />
      </Route>

      {/* Forum Routes */}
      <Route path="/forum" element={<MainLayout />}>
        <Route index element={<ForumCategoriesPage />} />
        <Route path="categories" element={<ForumCategoriesPage />} />
        <Route path="categories/:categoryId" element={<ForumTopics />} />
        <Route path="topics/:topicId" element={<ForumPosts />} />
        <Route path="topics/new" element={<ForumTopics />} />
        <Route path="search" element={<ForumSearch />} />
        <Route path="moderation" element={<ForumModeration />} />
      </Route>

      {/* Community Routes */}
      <Route path="/community" element={<MainLayout />}>
        <Route index element={<CommunityGroups />} />
        <Route path="groups" element={<CommunityGroups />} />
        <Route path="groups/:groupId" element={<CommunityGroups />} />
        <Route path="events" element={<CommunityEvents />} />
        <Route path="events/:eventId" element={<CommunityEvents />} />
        <Route path="challenges" element={<CommunityChallenges />} />
        <Route path="challenges/:challengeId" element={<CommunityChallenges />} />
        <Route path="leaderboards" element={<CommunityLeaderboards />} />
        <Route path="achievements" element={<CommunityAchievements />} />
      </Route>

      {/* Legal Routes */}
      <Route path="/legal" element={<MainLayout />}>
        <Route path="terms" element={<TermsOfServicePage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="dmca" element={<DMCAPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="cookies" element={<CookiePolicyPage />} />
      </Route>

      {/* Support Routes */}
      <Route path="/support" element={<MainLayout />}>
        <Route index element={<HelpCenterPage />} />
        <Route path="help" element={<HelpCenterPage />} />
        <Route path="help/:categoryId" element={<HelpCenterPage />} />
        <Route path="help/articles/:articleId" element={<HelpCenterPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="contact" element={<ContactSupportPage />} />
        <Route path="tickets" element={<SupportTickets />} />
        <Route path="tickets/:ticketId" element={<SupportTickets />} />
        <Route path="tickets/new" element={<SupportTickets />} />
        <Route path="guides" element={<GuidesPage />} />
        <Route path="guides/:guideId" element={<GuidesPage />} />
        <Route path="tutorials" element={<TutorialsPage />} />
        <Route path="tutorials/:tutorialId" element={<TutorialsPage />} />
        <Route path="troubleshooting" element={<TroubleshootingPage />} />
      </Route>

      {/* Marketing Routes */}
      <Route path="/marketing" element={<MainLayout />}>
        <Route path="landing/:campaignId" element={<LandingPages />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="referrals" element={<ReferralsPage />} />
        <Route path="affiliates" element={<AffiliatesPage />} />
        <Route path="partnerships" element={<PartnershipsPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
      </Route>

      {/* Campaign Routes */}
      <Route path="/campaigns" element={<MainLayout />}>
        <Route path="seasonal/:season" element={<SeasonalCampaigns />} />
        <Route path="events/:eventId" element={<EventCampaigns />} />
        <Route path="partnerships/:partnershipId" element={<PartnershipCampaigns />} />
      </Route>

      {/* Analytics Routes */}
      <Route path="/analytics" element={<MainLayout />}>
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="insights" element={<InsightsPage />} />
      </Route>

      {/* Mobile Routes */}
      <Route path="/mobile" element={<MainLayout />}>
        <Route path="app" element={<MobileAppPage />} />
        <Route path="responsive" element={<ResponsivePage />} />
      </Route>

      {/* SEO Routes */}
      <Route path="/sitemap.xml" element={<SitemapPage />} />
      <Route path="/robots.txt" element={<RobotsPage />} />

      {/* Error Routes */}
      <Route path="/error">
        <Route path="403" element={<ForbiddenPage />} />
        <Route path="500" element={<ServerErrorPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="offline" element={<OfflinePage />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes