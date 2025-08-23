import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { BreadcrumbNav } from '@/components/ui/enhanced/navigation/BreadcrumbNav';
import { EnhancedSidebar } from '@/components/ui/enhanced/navigation/EnhancedSidebar';
import { 
  SkeletonLoader, 
  ProfileSkeleton, 
  CardSkeleton, 
  FeedSkeleton,
  MediaGridSkeleton,
  StatsSkeleton 
} from '@/components/ui/enhanced/skeleton/SkeletonLoader';
import { 
  EmptyState, 
  NoDataEmptyState, 
  NoResultsEmptyState, 
  NoContentEmptyState 
} from '@/components/ui/enhanced/empty-states/EmptyState';
import { KeyboardShortcuts, defaultShortcuts } from '@/components/ui/enhanced/accessibility/KeyboardShortcuts';
import { SkipLinks } from '@/components/ui/enhanced/accessibility/SkipLinks';
import { 
  Expandable, 
  ShowMore, 
  Tabs, 
  Stepper 
} from '@/components/ui/enhanced/progressive-disclosure/ProgressiveDisclosure';
import { PhotoIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';

export const EnhancedUIDemo: React.FC = () => {
  const [showSkeletons, setShowSkeletons] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'UI Components', href: '/ui-components' },
    { label: 'Enhanced Demo' }
  ];

  const demoTabs = [
    {
      id: 'components',
      label: 'Components',
      content: (
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold mb-4">Skeleton Loading States</h3>
            <div className="flex items-center gap-4 mb-6">
              <Switch
                checked={showSkeletons}
                onCheckedChange={setShowSkeletons}
                id="skeleton-toggle"
              />
              <label htmlFor="skeleton-toggle" className="text-sm">
                Show Skeleton Loaders
              </label>
            </div>
            
            {showSkeletons ? (
              <div className="space-y-6">
                <div data-testid="profile-skeleton">
                  <ProfileSkeleton variant="luxury" />
                </div>
                <CardSkeleton variant="glass" />
                <MediaGridSkeleton count={6} variant="chrome" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-card rounded-2xl border">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold">John Doe</h4>
                      <p className="text-muted-foreground">Content Creator</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-card rounded-2xl border">
                  <h4 className="text-lg font-semibold mb-2">Sample Content Card</h4>
                  <p className="text-muted-foreground mb-4">
                    This is what actual content looks like when loaded.
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                      Action
                    </button>
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">
                      Secondary
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4">Empty States</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <NoDataEmptyState size="sm" />
              <NoResultsEmptyState 
                size="sm"
                action={{
                  label: 'Clear Filters',
                  onClick: () => console.log('Clear filters')
                }}
              />
              <NoContentEmptyState size="sm" />
              <EmptyState
                title="No notifications yet"
                description="We'll notify you when something important happens"
                iconType="users"
                size="sm"
                action={{
                  label: 'Create First Notification',
                  onClick: () => console.log('Create notification'),
                  variant: 'secondary'
                }}
              />
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      content: (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
            <p className="text-muted-foreground mb-4">
              Press <kbd className="px-2 py-1 bg-muted rounded text-sm">?</kbd> to see available shortcuts
            </p>
            <div className="p-4 bg-card rounded-lg border">
              <h4 className="font-medium mb-2">Available Shortcuts:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <kbd>?</kbd> - Show keyboard shortcuts</li>
                <li>• <kbd>Ctrl+K</kbd> - Open search</li>
                <li>• <kbd>G then H</kbd> - Go to home</li>
                <li>• <kbd>N</kbd> - Create new post</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4">Skip Links</h3>
            <p className="text-muted-foreground mb-4">
              Skip links help screen reader users navigate quickly to main content
            </p>
            <div className="p-4 bg-card rounded-lg border">
              <p className="text-sm">
                Skip links are invisible until focused with Tab key. Try tabbing through this page.
              </p>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'examples',
      label: 'Examples',
      content: (
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold mb-4">Progressive Disclosure</h3>
            
            <div className="space-y-4">
              <Expandable title="Expandable Section" icon={<CogIcon className="w-5 h-5" />}>
                <p className="text-muted-foreground">
                  This content was hidden and is now expanded. Progressive disclosure helps
                  reduce cognitive load by showing information only when needed.
                </p>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium mb-2">Additional Details</h5>
                  <p className="text-sm text-muted-foreground">
                    You can nest more content here, including interactive elements,
                    forms, or other components.
                  </p>
                </div>
              </Expandable>

              <ShowMore collapsedHeight={60}>
                <div className="space-y-4">
                  <p>This is a long piece of content that gets truncated initially...</p>
                  <p>But when you click "Show more", you can see additional paragraphs.</p>
                  <p>This pattern is useful for descriptions, articles, or any lengthy text content.</p>
                  <p>It helps keep the interface clean while allowing access to full information.</p>
                  <p>The transition is smooth and provides good user experience.</p>
                </div>
              </ShowMore>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4">Step-by-Step Processes</h3>
            <Stepper
              steps={[
                {
                  id: 'setup',
                  label: 'Setup',
                  description: 'Configure your account',
                  content: (
                    <div className="p-6 bg-card rounded-lg border">
                      <h4 className="font-semibold mb-2">Account Setup</h4>
                      <p className="text-muted-foreground">
                        Complete your profile information and preferences.
                      </p>
                    </div>
                  )
                },
                {
                  id: 'content',
                  label: 'Add Content',
                  description: 'Upload your first content',
                  content: (
                    <div className="p-6 bg-card rounded-lg border">
                      <h4 className="font-semibold mb-2">Content Creation</h4>
                      <p className="text-muted-foreground">
                        Start by uploading your first piece of content to share with your audience.
                      </p>
                    </div>
                  )
                },
                {
                  id: 'launch',
                  label: 'Go Live',
                  description: 'Publish and share',
                  content: (
                    <div className="p-6 bg-card rounded-lg border">
                      <h4 className="font-semibold mb-2">Ready to Launch</h4>
                      <p className="text-muted-foreground">
                        Your account is ready! Start sharing and engaging with your community.
                      </p>
                    </div>
                  )
                }
              ]}
            />
          </section>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SkipLinks />
      <KeyboardShortcuts shortcuts={defaultShortcuts} />
      
      <div className="flex">
        <EnhancedSidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          variant="glass"
          userProfile={{
            name: 'Demo User',
            role: 'Content Creator'
          }}
        />
        
        <main className="flex-1 p-8" id="main">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <BreadcrumbNav items={breadcrumbItems} variant="glass" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Enhanced UI Components Demo
                </h1>
                <p className="text-xl text-muted-foreground">
                  Explore advanced UI patterns with accessibility features
                </p>
              </motion.div>
            </div>

            <Tabs
              tabs={demoTabs}
              variant="luxury"
              className="w-full"
            />
          </div>
        </main>
      </div>
    </div>
  );
};