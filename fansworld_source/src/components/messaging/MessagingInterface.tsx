import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Send, 
  Paperclip, 
  Image, 
  Video, 
  Smile, 
  MoreHorizontal, 
  Crown,
  Heart,
  ThumbsUp,
  Laugh,
  DollarSign,
  Edit,
  Trash2,
  Flag,
  Reply,
  Copy,
  Download
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  useConversations, 
  useMessages, 
  usePresence, 
  useFileUpload, 
  useMessageReporting 
} from '@/hooks/useMessaging';
import { Conversation, Message, MessageReaction, MessageReport } from '@/lib/messaging';
import { useCurrencyFormatter } from '@/hooks/useStripeConnect';
import { toast } from '@/components/ui/use-toast';

interface MessagingInterfaceProps {
  selectedConversationId?: string;
  onConversationSelect?: (conversationId: string) => void;
}

export const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  selectedConversationId,
  onConversationSelect
}) => {
  const { user } = useAuth();
  const { formatCurrency } = useCurrencyFormatter();
  const { conversations, isLoading: conversationsLoading, totalUnreadCount } = useConversations();
  const { isUserOnline } = usePresence();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeConversationId, setActiveConversationId] = useState(selectedConversationId || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading: messagesLoading,
    sendMessage,
    addReaction,
    removeReaction,
    markAsRead,
    startTyping,
    stopTyping,
    typingUsers
  } = useMessages(activeConversationId);

  const { uploadFile } = useFileUpload();
  const { reportMessage } = useMessageReporting();

  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Filter conversations based on search
  const filteredConversations = conversations?.filter(conv => {
    const otherParticipant = conv.participants?.find(p => p.user_id !== user?.id);
    const displayName = otherParticipant?.user?.profiles?.display_name || 'Unknown User';
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  // Get active conversation
  const activeConversation = conversations?.find(c => c.id === activeConversationId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (activeConversationId && messages?.length) {
      markAsRead.mutate();
    }
  }, [activeConversationId, messages, markAsRead]);

  // Handle typing indicators
  useEffect(() => {
    if (messageInput.length > 0 && !isTyping) {
      setIsTyping(true);
      startTyping();
    } else if (messageInput.length === 0 && isTyping) {
      setIsTyping(false);
      stopTyping();
    }
  }, [messageInput, isTyping, startTyping, stopTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversationId) return;

    try {
      await sendMessage.mutateAsync({
        content: messageInput,
        replyToMessageId: replyingTo?.id
      });
      setMessageInput('');
      setReplyingTo(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const handleReaction = async (messageId: string, reactionType: MessageReaction['reaction_type']) => {
    try {
      const message = messages?.find(m => m.id === messageId);
      const existingReaction = message?.reactions?.find(r => r.user_id === user?.id && r.reaction_type === reactionType);

      if (existingReaction) {
        await removeReaction.mutateAsync({ messageId, reactionType });
      } else {
        await addReaction.mutateAsync({ messageId, reactionType });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add reaction',
        variant: 'destructive'
      });
    }
  };

  const handleFileUpload = async (file: File, messageId: string) => {
    try {
      await uploadFile.mutateAsync({ messageId, file });
      toast({
        title: 'Success',
        description: 'File uploaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive'
      });
    }
  };

  const handleReportMessage = async (messageId: string, reason: string) => {
    try {
      await reportMessage.mutateAsync({ 
        messageId, 
        reason: reason as MessageReport['reason'] 
      });
      toast({
        title: 'Success',
        description: 'Message reported successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to report message',
        variant: 'destructive'
      });
    }
  };

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.sender_id === user?.id;
    const senderName = message.sender?.profiles?.display_name || 'Unknown User';
    const senderAvatar = message.sender?.profiles?.avatar_url;
    const isVerified = message.sender?.profiles?.is_verified;

    return (
      <div
        key={message.id}
        className={`flex items-start gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''} mb-4`}
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className={`flex-1 ${isOwnMessage ? 'text-right' : ''}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{senderName}</span>
            {isVerified && <Crown className="w-4 h-4 text-yellow-500" />}
            <span className="text-xs text-muted-foreground">
              {new Date(message.sent_at).toLocaleTimeString()}
            </span>
          </div>

          {/* Reply indicator */}
          {message.reply_to && (
            <div className="mb-2 p-2 bg-muted rounded text-sm">
              <span className="text-muted-foreground">Replying to:</span>
              <p className="truncate">{message.reply_to.content}</p>
            </div>
          )}

          {/* Message content */}
          <div
            className={`p-3 rounded-lg max-w-md ${
              isOwnMessage 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : 'bg-muted'
            } ${message.is_paid ? 'border-2 border-yellow-500' : ''}`}
          >
            {message.is_paid && (
              <div className="flex items-center gap-2 mb-2 text-yellow-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Paid Message - {formatCurrency(message.price_cents)}
                </span>
              </div>
            )}

            <p className="text-sm">{message.content}</p>

            {/* Attachments */}
            {message.attachments?.map((attachment) => (
              <div key={attachment.id} className="mt-2">
                {attachment.file_type.startsWith('image/') ? (
                  <img 
                    src={attachment.file_url} 
                    alt={attachment.file_name}
                    className="max-w-full rounded cursor-pointer"
                    onClick={() => window.open(attachment.file_url, '_blank')}
                  />
                ) : attachment.file_type.startsWith('video/') ? (
                  <video 
                    src={attachment.file_url} 
                    controls 
                    className="max-w-full rounded"
                  />
                ) : (
                  <a 
                    href={attachment.file_url} 
                    download={attachment.file_name}
                    className="flex items-center gap-2 p-2 bg-background rounded text-sm hover:bg-muted"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>{attachment.file_name}</span>
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}

            {message.is_edited && (
              <span className="text-xs text-muted-foreground mt-1 block">
                (edited)
              </span>
            )}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction) => (
                <Button
                  key={reaction.id}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleReaction(message.id, reaction.reaction_type)}
                >
                  {reaction.reaction_type === 'like' && '👍'}
                  {reaction.reaction_type === 'love' && '❤️'}
                  {reaction.reaction_type === 'laugh' && '😂'}
                  {reaction.reaction_type === 'wow' && '😮'}
                  {reaction.reaction_type === 'sad' && '😢'}
                  {reaction.reaction_type === 'angry' && '😠'}
                </Button>
              ))}
            </div>
          )}

          {/* Message actions */}
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(message)}
            >
              <Reply className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(message.id, 'like')}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(message.id, 'love')}
            >
              <Heart className="w-4 h-4" />
            </Button>
            {!isOwnMessage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReportMessage(message.id, 'inappropriate_content')}
              >
                <Flag className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            {totalUnreadCount > 0 && (
              <Badge variant="destructive" className="px-2 py-1">
                {totalUnreadCount}
              </Badge>
            )}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const otherParticipant = conversation.participants?.find(p => p.user_id !== user?.id);
            const displayName = otherParticipant?.user?.profiles?.display_name || 'Unknown User';
            const avatarUrl = otherParticipant?.user?.profiles?.avatar_url;
            const isVerified = otherParticipant?.user?.profiles?.is_verified;
            const isOnline = isUserOnline(otherParticipant?.user_id || '');
            const unreadCount = otherParticipant?.unread_count || 0;

            return (
              <div
                key={conversation.id}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 ${
                  activeConversationId === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => {
                  setActiveConversationId(conversation.id);
                  onConversationSelect?.(conversation.id);
                }}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{displayName}</span>
                    {isVerified && <Crown className="w-4 h-4 text-yellow-500" />}
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message?.content || 'No messages yet'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {conversation.last_message_at ? 
                        new Date(conversation.last_message_at).toLocaleDateString() : 
                        ''
                      }
                    </span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="px-2 py-1 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversationId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeConversation && (() => {
                    const otherParticipant = activeConversation.participants?.find(p => p.user_id !== user?.id);
                    const displayName = otherParticipant?.user?.profiles?.display_name || 'Unknown User';
                    const avatarUrl = otherParticipant?.user?.profiles?.avatar_url;
                    const isVerified = otherParticipant?.user?.profiles?.is_verified;
                    const isOnline = isUserOnline(otherParticipant?.user_id || '');

                    return (
                      <>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={avatarUrl} alt={displayName} />
                          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{displayName}</span>
                            {isVerified && <Crown className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages?.map(renderMessage)}
                  {typingUsers.length > 0 && (
                    <div className="text-sm text-muted-foreground italic">
                      {typingUsers.length === 1 ? 'Someone is' : 'People are'} typing...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Reply indicator */}
            {replyingTo && (
              <div className="p-3 border-t bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Reply className="w-4 h-4" />
                    <span className="text-sm">Replying to: {replyingTo.content}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-card">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*,video/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        // Handle file upload
                        console.log('File selected:', file);
                      }
                    };
                    input.click();
                  }}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <Button type="button" variant="ghost" size="sm">
                  <Image className="w-4 h-4" />
                </Button>
                
                <Button type="button" variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>

                <Button type="submit" disabled={!messageInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};