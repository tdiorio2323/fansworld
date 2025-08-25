import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { 
  messagingService, 
  Conversation, 
  Message, 
  MessageReaction, 
  UserPresence,
  MessageReport
} from '@/lib/messaging';

/**
 * Hook for managing conversations
 */
export const useConversations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: conversations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await messagingService.getConversations();
    },
    enabled: !!user?.id,
  });

  const createDirectConversation = useMutation({
    mutationFn: async (otherUserId: string) => {
      return await messagingService.getOrCreateDirectConversation(otherUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = messagingService.subscribeToAllConversations({
      onConversationUpdated: (conversation) => {
        queryClient.setQueryData(['conversations', user.id], (old: Conversation[] | undefined) => {
          if (!old) return [conversation];
          const index = old.findIndex(c => c.id === conversation.id);
          if (index >= 0) {
            const newConversations = [...old];
            newConversations[index] = conversation;
            return newConversations.sort((a, b) => 
              new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
            );
          }
          return [conversation, ...old];
        });
      },
      onNewMessage: (message) => {
        // Update conversation list when new message arrives
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        
        // Update specific conversation messages
        queryClient.setQueryData(['messages', message.conversation_id], (old: Message[] | undefined) => {
          if (!old) return [message];
          return [...old, message];
        });
      }
    });

    return () => unsubscribe();
  }, [user?.id, queryClient]);

  return {
    conversations,
    isLoading,
    error,
    createDirectConversation,
    totalUnreadCount: conversations?.reduce((total, conv) => {
      const userParticipant = conv.participants?.find(p => p.user_id === user?.id);
      return total + (userParticipant?.unread_count || 0);
    }, 0) || 0,
  };
};

/**
 * Hook for managing messages in a conversation
 */
export const useMessages = (conversationId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const {
    data: messages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      return await messagingService.getMessages(conversationId);
    },
    enabled: !!conversationId,
  });

  const sendMessage = useMutation({
    mutationFn: async ({ 
      content, 
      messageType, 
      replyToMessageId, 
      isPaid, 
      priceCents 
    }: {
      content: string;
      messageType?: Message['message_type'];
      replyToMessageId?: string;
      isPaid?: boolean;
      priceCents?: number;
    }) => {
      return await messagingService.sendMessage(
        conversationId,
        content,
        messageType,
        replyToMessageId,
        isPaid,
        priceCents
      );
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['messages', conversationId], (old: Message[] | undefined) => {
        if (!old) return [newMessage];
        return [...old, newMessage];
      });
      
      // Update conversations list
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const editMessage = useMutation({
    mutationFn: async ({ messageId, newContent }: { messageId: string; newContent: string }) => {
      return await messagingService.editMessage(messageId, newContent);
    },
    onSuccess: (updatedMessage) => {
      queryClient.setQueryData(['messages', conversationId], (old: Message[] | undefined) => {
        if (!old) return [updatedMessage];
        return old.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg);
      });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (messageId: string) => {
      return await messagingService.deleteMessage(messageId);
    },
    onSuccess: (_, messageId) => {
      queryClient.setQueryData(['messages', conversationId], (old: Message[] | undefined) => {
        if (!old) return [];
        return old.filter(msg => msg.id !== messageId);
      });
    },
  });

  const addReaction = useMutation({
    mutationFn: async ({ 
      messageId, 
      reactionType 
    }: { 
      messageId: string; 
      reactionType: MessageReaction['reaction_type'] 
    }) => {
      return await messagingService.addReaction(messageId, reactionType);
    },
    onSuccess: (reaction) => {
      queryClient.setQueryData(['messages', conversationId], (old: Message[] | undefined) => {
        if (!old) return [];
        return old.map(msg => {
          if (msg.id === reaction.message_id) {
            return {
              ...msg,
              reactions: [...(msg.reactions || []), reaction]
            };
          }
          return msg;
        });
      });
    },
  });

  const removeReaction = useMutation({
    mutationFn: async ({ 
      messageId, 
      reactionType 
    }: { 
      messageId: string; 
      reactionType: MessageReaction['reaction_type'] 
    }) => {
      return await messagingService.removeReaction(messageId, reactionType);
    },
    onSuccess: (_, { messageId, reactionType }) => {
      queryClient.setQueryData(['messages', conversationId], (old: Message[] | undefined) => {
        if (!old) return [];
        return old.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              reactions: msg.reactions?.filter(r => 
                !(r.user_id === user?.id && r.reaction_type === reactionType)
              ) || []
            };
          }
          return msg;
        });
      });
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (upToMessageId?: string) => {
      return await messagingService.markMessagesAsRead(conversationId, upToMessageId);
    },
    onSuccess: () => {
      // Update conversation unread count
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const startTyping = useCallback(async () => {
    if (!isTyping) {
      setIsTyping(true);
      await messagingService.updatePresence('online', conversationId);
    }
  }, [isTyping, conversationId]);

  const stopTyping = useCallback(async () => {
    if (isTyping) {
      setIsTyping(false);
      await messagingService.updatePresence('online');
    }
  }, [isTyping]);

  // Set up real-time subscriptions for this conversation
  useEffect(() => {
    if (!conversationId || !user?.id) return;

    const unsubscribe = messagingService.subscribeToConversation(conversationId, {
      onMessageReceived: (message) => {
        queryClient.setQueryData(['messages', conversationId], (old: Message[] | undefined) => {
          if (!old) return [message];
          // Avoid duplicates
          if (old.some(msg => msg.id === message.id)) return old;
          return [...old, message];
        });
      },
      onMessageUpdated: (message) => {
        queryClient.setQueryData(['messages', conversationId], (old: Message[] | undefined) => {
          if (!old) return [message];
          return old.map(msg => msg.id === message.id ? message : msg);
        });
      },
      onMessageDeleted: (messageId) => {
        queryClient.setQueryData(['messages', conversationId], (old: Message[] | undefined) => {
          if (!old) return [];
          return old.filter(msg => msg.id !== messageId);
        });
      },
      onTypingUpdate: (userId, isTyping) => {
        if (userId === user.id) return; // Don't show own typing
        
        setTypingUsers(prev => {
          if (isTyping) {
            return prev.includes(userId) ? prev : [...prev, userId];
          } else {
            return prev.filter(id => id !== userId);
          }
        });
      }
    });

    return () => unsubscribe();
  }, [conversationId, user?.id, queryClient]);

  // Auto-typing cleanup
  useEffect(() => {
    if (!isTyping) return;

    const timeout = setTimeout(() => {
      stopTyping();
    }, 3000); // Stop typing after 3 seconds

    return () => clearTimeout(timeout);
  }, [isTyping, stopTyping]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    markAsRead,
    startTyping,
    stopTyping,
    isTyping,
    typingUsers,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  };
};

/**
 * Hook for managing user presence
 */
export const usePresence = () => {
  const { user } = useAuth();
  const [presenceMap, setPresenceMap] = useState<Map<string, UserPresence>>(new Map());

  const updatePresence = useMutation({
    mutationFn: async (status: UserPresence['status']) => {
      return await messagingService.updatePresence(status);
    },
  });

  const getUserPresence = useCallback(async (userId: string): Promise<UserPresence | null> => {
    try {
      const presence = await messagingService.getUserPresence(userId);
      if (presence) {
        setPresenceMap(prev => new Map(prev).set(userId, presence));
      }
      return presence;
    } catch (error) {
      console.error('Error fetching user presence:', error);
      return null;
    }
  }, []);

  const isUserOnline = useCallback((userId: string): boolean => {
    const presence = presenceMap.get(userId);
    return presence?.status === 'online';
  }, [presenceMap]);

  const getLastSeen = useCallback((userId: string): string | null => {
    const presence = presenceMap.get(userId);
    return presence?.last_seen_at || null;
  }, [presenceMap]);

  // Update presence when user becomes active/inactive
  useEffect(() => {
    if (!user?.id) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence.mutate('away');
      } else {
        updatePresence.mutate('online');
      }
    };

    const handleBeforeUnload = () => {
      updatePresence.mutate('offline');
    };

    // Set initial presence
    updatePresence.mutate('online');

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updatePresence.mutate('offline');
    };
  }, [user?.id, updatePresence]);

  return {
    updatePresence,
    getUserPresence,
    isUserOnline,
    getLastSeen,
    presenceMap
  };
};

/**
 * Hook for file uploads
 */
export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<Map<string, number>>(new Map());

  const uploadFile = useMutation({
    mutationFn: async ({ messageId, file }: { messageId: string; file: File }) => {
      return await messagingService.uploadAttachment(messageId, file, (progress) => {
        setUploadProgress(prev => new Map(prev).set(messageId, progress));
      });
    },
    onSuccess: (_, { messageId }) => {
      setUploadProgress(prev => {
        const newMap = new Map(prev);
        newMap.delete(messageId);
        return newMap;
      });
    },
    onError: (_, { messageId }) => {
      setUploadProgress(prev => {
        const newMap = new Map(prev);
        newMap.delete(messageId);
        return newMap;
      });
    }
  });

  const getUploadProgress = useCallback((messageId: string): number => {
    return uploadProgress.get(messageId) || 0;
  }, [uploadProgress]);

  return {
    uploadFile,
    getUploadProgress,
    isUploading: uploadFile.isPending
  };
};

/**
 * Hook for message search
 */
export const useMessageSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMessages = useMutation({
    mutationFn: async ({ 
      query, 
      conversationId 
    }: { 
      query: string; 
      conversationId?: string 
    }) => {
      setIsSearching(true);
      try {
        const results = await messagingService.searchMessages(query, conversationId);
        setSearchResults(results);
        return results;
      } finally {
        setIsSearching(false);
      }
    },
  });

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchMessages,
    clearSearch
  };
};

/**
 * Hook for reporting messages
 */
export const useMessageReporting = () => {
  const reportMessage = useMutation({
    mutationFn: async ({ 
      messageId, 
      reason, 
      description 
    }: { 
      messageId: string; 
      reason: MessageReport['reason']; 
      description?: string 
    }) => {
      return await messagingService.reportMessage(messageId, reason, description);
    },
  });

  return {
    reportMessage
  };
};

/**
 * Hook for getting unread message count
 */
export const useUnreadCount = () => {
  const { user } = useAuth();

  const {
    data: unreadCount,
    isLoading,
    error
  } = useQuery({
    queryKey: ['unread-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      return await messagingService.getUnreadCount();
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    unreadCount: unreadCount || 0,
    isLoading,
    error
  };
};

/**
 * Hook for cleaning up messaging subscriptions
 */
export const useMessagingCleanup = () => {
  useEffect(() => {
    return () => {
      messagingService.cleanup();
    };
  }, []);
};