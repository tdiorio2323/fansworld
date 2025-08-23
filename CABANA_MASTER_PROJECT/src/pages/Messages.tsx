import React from 'react';
import InstagramNavbar from '@/components/InstagramNavbar';
import InstagramMessaging from '@/components/InstagramMessaging';
import { useMessagingCleanup } from '@/hooks/useMessaging';

export default function Messages() {
  // Cleanup messaging subscriptions when component unmounts
  useMessagingCleanup();

  return (
    <div className="min-h-screen bg-gray-50">
      <InstagramNavbar />
      
      <div className="pt-16 lg:pl-64 lg:pt-0 h-screen">
        <InstagramMessaging />
      </div>
    </div>
  );
}