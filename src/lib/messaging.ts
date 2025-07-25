// TEMPORARILY DISABLED - Missing database tables
// This messaging system requires many tables that don't exist in current schema:
// messages, conversations, message_reactions, message_attachments, etc.

import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Stub types for messaging system
export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  title?: string;
  description?: string;
  avatar_url?: string;
  created_by: string;
  is_archived: boolean;
  last_message_id?: string;
  last_message_at: string;
  message_count: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'member' | 'admin' | 'moderator';
  joined_at: string;
  left_at?: string;
  is_muted: boolean;
  is_pinned: boolean;
  unread_count: number;
  last_read_at?: string;
  custom_settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'gift' | 'tip';
  content: string;
  is_paid: boolean;
  price?: number;
  is_deleted: boolean;
  parent_message_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
    is_verified: boolean;
  };
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  read_receipts?: MessageReadReceipt[];
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  thumbnail_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
  user?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface MessageReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
  created_at: string;
}

export interface UserPresence {
  user_id: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  last_seen_at: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MessageReport {
  id: string;
  message_id: string;
  reported_by: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
}

// Stub implementations - return empty data or basic functionality
export async function createConversation(
  type: 'direct' | 'group',
  participantIds: string[],
  title?: string,
  description?: string
): Promise<Conversation> {
  return {
    id: 'temp-' + Date.now(),
    type,
    title,
    description,
    created_by: 'current-user',
    is_archived: false,
    last_message_at: new Date().toISOString(),
    message_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  // Stub implementation - returns empty array
  return [];
}

export async function getConversationMessages(
  conversationId: string,
  limit: number = 50,
  before?: string
): Promise<Message[]> {
  // Stub implementation - returns empty array
  return [];
}

export async function sendMessage(
  conversationId: string,
  content: string,
  messageType: Message['message_type'] = 'text',
  price?: number,
  attachments?: File[]
): Promise<Message> {
  return {
    id: 'temp-' + Date.now(),
    conversation_id: conversationId,
    sender_id: 'current-user',
    message_type: messageType,
    content,
    is_paid: !!price,
    price,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function editMessage(messageId: string, newContent: string): Promise<Message> {
  return {
    id: messageId,
    conversation_id: 'temp-conversation',
    sender_id: 'current-user',
    message_type: 'text',
    content: newContent,
    is_paid: false,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function deleteMessage(messageId: string): Promise<Message> {
  return {
    id: messageId,
    conversation_id: 'temp-conversation',
    sender_id: 'current-user',
    message_type: 'text',
    content: '',
    is_paid: false,
    is_deleted: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function addMessageReaction(
  messageId: string,
  reactionType: string
): Promise<MessageReaction> {
  return {
    id: 'temp-' + Date.now(),
    message_id: messageId,
    user_id: 'current-user',
    reaction_type: reactionType,
    created_at: new Date().toISOString(),
  };
}

export async function removeMessageReaction(
  messageId: string,
  reactionType: string
): Promise<void> {
  // Stub implementation
}

export async function markMessagesAsRead(conversationId: string): Promise<number> {
  return 0;
}

export async function updateUserPresence(
  status: UserPresence['status'],
  metadata?: Record<string, unknown>
): Promise<void> {
  // Stub implementation
}

export async function getUserPresence(userId: string): Promise<UserPresence | null> {
  return null;
}

export async function uploadMessageAttachment(
  messageId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<MessageAttachment> {
  return {
    id: 'temp-' + Date.now(),
    message_id: messageId,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type,
    file_url: 'temp-url',
    created_at: new Date().toISOString(),
  };
}

export async function reportMessage(
  messageId: string,
  reason: string,
  description?: string
): Promise<MessageReport> {
  return {
    id: 'temp-' + Date.now(),
    message_id: messageId,
    reported_by: 'current-user',
    reason,
    description,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function searchMessages(
  query: string,
  conversationId?: string,
  limit: number = 20
): Promise<Message[]> {
  return [];
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  return 0;
}

// Stub realtime subscription functions
export function subscribeToConversation(
  conversationId: string,
  callbacks: {
    onNewMessage?: (message: Message) => void;
    onMessageUpdate?: (message: Message) => void;
    onMessageDelete?: (messageId: string) => void;
    onUserPresence?: (presence: UserPresence) => void;
  }
): RealtimeChannel | null {
  // Return null for now since we don't have real messaging
  return null;
}

export function unsubscribeFromConversation(channel: RealtimeChannel): void {
  // Stub implementation
}