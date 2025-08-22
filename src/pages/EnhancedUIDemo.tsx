import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SkeletonLoader,
  ProfileSkeleton,
  CardSkeleton,
  FeedSkeleton,
  MediaGridSkeleton,
  BreadcrumbNav,
  EnhancedSidebar,
  KeyboardShortcuts,
  defaultShortcuts,
  SkipLinks,
  EmptyState,
  NoDataEmptyState,
  NoResultsEmptyState,
  NoContentEmptyState,
  Expandable,
  ShowMore,
  Tabs,
  Stepper
} from '@/components/ui/enhanced';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  StarIcon,
  HeartIcon,
  PhotoIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export const EnhancedUIDemo: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false);
  const [activeTab, setActiveTab] = useState('components');
  const [currentStep, setCurrentStep] = useState(0);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'UI Components', href: '/ui' },
    { label: 'Enhanced Demo' }
  ];

  const demoTabs = [
    {
      id: 'components',
      label: 'Components',
      icon: <StarIcon className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4">Empty States</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NoDataEmptyState variant="luxury" size="sm" />
              <NoResultsEmptyState variant="chrome" size="sm" />
              <NoContentEmptyState variant="glass" size="sm" />
              <EmptyState
                title="Custom Empty State"
                description="This is a custom empty state with luxury styling"
                iconType="users"
                variant="luxury"
                size="sm"
                action={{
                  label: "Get Started",
                  onClick: () => console.log('Get started'),
                  variant: 'primary'
                }}
              />
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Progressive Disclosure</h3>
            <div className="space-y-4">
              <Expandable
                title="Advanced Settings"
                variant="luxury"
                icon={<CogIcon className="w-5 h-5" />}
              >
                <p className="text-muted-foreground">
                  This section contains advanced configuration options that are hidden by default
                  to reduce cognitive load for new users.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <span>Auto-save enabled</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <span>Performance mode</span>
                    <Button variant="outline" size="sm">Settings</Button>
                  </div>
                </div>
              </Expandable>

              <ShowMore
                variant="glass"
                collapsedHeight={80}
                showLabel="Read more"
                hideLabel="Show less"
              >
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p className="text-muted-foreground mt-4">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </ShowMore>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'navigation',
      label: 'Navigation',
      icon: <ChartBarIcon className="w-4 h-4" />,
      badge: 'New',
      content: (
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4">Breadcrumb Navigation</h3>
            <div className="space-y-4">
              <BreadcrumbNav items={breadcrumbItems} variant="luxury" />
              <BreadcrumbNav items={breadcrumbItems} variant="chrome" />
              <BreadcrumbNav items={breadcrumbItems} variant="glass" />
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Enhanced Sidebar</h3>
            <div className="h-96 border rounded-lg overflow-hidden">
              <EnhancedSidebar
                collapsed={sidebarCollapsed}
                onCollapse={setSidebarCollapsed}
                variant="luxury"
                userProfile={{
                  name: "Tyler DiOrio",
                  role: "Creator",
                  avatar: "/placeholder.svg"
                }}
              />
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'loading',
      label: 'Loading States',
      icon: <PhotoIcon className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          <div className="flex gap-4">
            <Button
              onClick={() => setShowSkeletons(!showSkeletons)}
              variant="outline"
            >
              {showSkeletons ? 'Hide' : 'Show'} Skeletons
            </Button>
          </div>

          {showSkeletons ? (
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold mb-4">Profile Skeletons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileSkeleton variant="luxury" />
                  <ProfileSkeleton variant="chrome" />
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">Card Skeletons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CardSkeleton variant="glass" />
                  <CardSkeleton variant="default" />
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">Media Grid Skeleton</h3>
                <MediaGridSkeleton variant="luxury" count={6} />
              </section>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Click "Show Skeletons" to see loading states</p>
            </div>
          )}
        </div>
      )
    }
  ];

  const setupSteps = [
    {
      id: 'welcome',
      label: 'Welcome',
      description: 'Get started',
      content: (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Welcome to Enhanced UI</h3>
          <p className="text-muted-foreground">
            This demo showcases the enhanced UI components with luxury styling and smooth animations.
          </p>
        </Card>
      )
    },
    {
      id: 'features',
      label: 'Features',
      description: 'Explore capabilities',
      content: (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Key Features</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Skeleton loading states with multiple variants</li>
            <li>• Enhanced navigation with breadcrumbs and sidebar</li>
            <li>• Accessibility features and keyboard shortcuts</li>
            <li>• Empty states with customizable actions</li>
            <li>• Progressive disclosure patterns</li>
          </ul>
        </Card>
      )
    },
    {
      id: 'complete',
      label: 'Complete',
      description: 'Ready to use',
      content: (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Setup Complete!</h3>
          <p className="text-muted-foreground">
            You're now ready to use all the enhanced UI components in your application.
          </p>
          <Button className="mt-4">Start Building</Button>
        </Card>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SkipLinks />
      <KeyboardShortcuts shortcuts={defaultShortcuts} />
      
      <div className="container mx-auto p-6 space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-luxury bg-clip-text text-transparent">
            Enhanced UI Components
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive set of enhanced UI components with luxury styling, 
            accessibility features, and smooth animations.
          </p>
        </motion.header>

        <BreadcrumbNav items={breadcrumbItems} variant="luxury" />

        <Tabs
          tabs={demoTabs}
          variant="luxury"
          onChange={setActiveTab}
        />

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Setup Stepper Example</h2>
          <Stepper
            steps={setupSteps}
            currentStep={currentStep}
            variant="luxury"
            onStepChange={setCurrentStep}
          />
        </section>
      </div>
    </div>
  );
};