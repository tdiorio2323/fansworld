import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { MessagingInterface } from '@/components/messaging/MessagingInterface';
import { useMessagingCleanup } from '@/hooks/useMessaging';

export default function Messages() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  
  // Cleanup messaging subscriptions when component unmounts
  useMessagingCleanup();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="lg:pl-64 pb-20 lg:pb-0 h-screen">
        <MessagingInterface
          selectedConversationId={selectedConversationId}
          onConversationSelect={setSelectedConversationId}
        />
      </div>
    </div>
  );
}