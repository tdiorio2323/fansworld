import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Send, 
  Image as ImageIcon, 
  Heart, 
  Smile, 
  Crown,
  Circle,
  Phone,
  Video,
  Info,
  MoreHorizontal,
  ArrowLeft,
  Camera,
  Mic,
  Plus,
  DollarSign,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface Conversation {
  id: string;
  name: string;
  username: string;
  avatar: string;
  is_verified: boolean;
  is_online: boolean;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_creator: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'paid' | 'tip';
  is_read: boolean;
  price?: number;
  is_purchased?: boolean;
}

export default function InstagramMessaging() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        name: 'Sophia Rose',
        username: 'sophia_luxury',
        avatar: '/lovable-uploads/2db52d3c-95ff-4d97-9f88-8201d599afdf.png',
        is_verified: true,
        is_online: true,
        last_message: 'Thanks for the tip! 💖',
        last_message_time: '2m',
        unread_count: 2,
        is_creator: true
      },
      {
        id: '2',
        name: 'Luna Belle',
        username: 'luna_model',
        avatar: '/lovable-uploads/bf0fcf1a-8488-4afa-b9ae-463c6a03c31c.png',
        is_verified: true,
        is_online: false,
        last_message: 'New exclusive content available!',
        last_message_time: '1h',
        unread_count: 0,
        is_creator: true
      },
      {
        id: '3',
        name: 'Alex Fitness',
        username: 'alex_fit',
        avatar: '/lovable-uploads/cb53b74b-f714-4e45-a399-b61b2f3de84f.png',
        is_verified: true,
        is_online: true,
        last_message: 'Check out my latest workout video',
        last_message_time: '3h',
        unread_count: 1,
        is_creator: true
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        sender_id: '1',
        content: 'Hey! Thanks for subscribing to my content! 💕',
        timestamp: '10:30 AM',
        type: 'text',
        is_read: true
      },
      {
        id: '2',
        sender_id: user?.id || 'me',
        content: 'Love your content! Keep it up! 🔥',
        timestamp: '10:32 AM',
        type: 'text',
        is_read: true
      },
      {
        id: '3',
        sender_id: '1',
        content: 'I have some exclusive content available for $9.99. Want to see? 😉',
        timestamp: '10:35 AM',
        type: 'paid',
        price: 999,
        is_purchased: false,
        is_read: false
      },
      {
        id: '4',
        sender_id: '1',
        content: 'Thanks for the tip! 💖',
        timestamp: '10:37 AM',
        type: 'text',
        is_read: false
      }
    ];

    setConversations(mockConversations);
    setMessages(mockMessages);
    setActiveConversation(mockConversations[0]);
    
    // Check if mobile
    setIsMobile(window.innerWidth < 768);
  }, [user]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Math.random().toString(36),
      sender_id: user?.id || 'me',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      is_read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ConversationsList = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-100 border-0 rounded-full"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors",
              activeConversation?.id === conversation.id && "bg-blue-50"
            )}
            onClick={() => setActiveConversation(conversation)}
          >
            <div className="relative">
              <Avatar className="w-14 h-14">
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              {conversation.is_online && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm truncate">
                  {conversation.name}
                </span>
                {conversation.is_verified && (
                  <Crown className="w-4 h-4 text-blue-500" />
                )}
                {conversation.is_creator && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    Creator
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 truncate">
                {conversation.last_message}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500">
                {conversation.last_message_time}
              </span>
              
              {conversation.unread_count > 0 && (
                <Badge className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                  {conversation.unread_count}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatArea = () => (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={() => setActiveConversation(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <Avatar className="w-10 h-10">
            <AvatarImage src={activeConversation?.avatar} alt={activeConversation?.name} />
            <AvatarFallback>{activeConversation?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {activeConversation?.name}
              </span>
              {activeConversation?.is_verified && (
                <Crown className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Circle className={cn("w-2 h-2 rounded-full", activeConversation?.is_online ? "bg-green-500" : "bg-gray-300")} />
              <span>{activeConversation?.is_online ? 'Active now' : 'Offline'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === user?.id || message.sender_id === 'me';
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                isOwnMessage ? "justify-end" : "justify-start"
              )}
            >
              {!isOwnMessage && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activeConversation?.avatar} alt={activeConversation?.name} />
                  <AvatarFallback>{activeConversation?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              
              <div className={cn("max-w-xs lg:max-w-md", isOwnMessage ? "order-1" : "order-2")}>
                {message.type === 'paid' && !message.is_purchased ? (
                  <Card className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4" />
                      <span className="font-semibold">Paid Message</span>
                    </div>
                    <p className="text-sm mb-3">Exclusive content available</p>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="w-full bg-white text-purple-600 hover:bg-gray-100"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Unlock for {formatPrice(message.price || 0)}
                    </Button>
                  </Card>
                ) : (
                  <div
                    className={cn(
                      "px-4 py-2 rounded-2xl max-w-xs break-words",
                      isOwnMessage
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {message.timestamp}
                  </span>
                  {isOwnMessage && (
                    <div className="text-xs text-gray-500">
                      {message.is_read ? '✓✓' : '✓'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Camera className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Mic className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="rounded-full pr-20 bg-gray-100 border-0"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Smile className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="rounded-full w-10 h-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Mobile view
  if (isMobile) {
    return (
      <div className="h-screen bg-white">
        {!activeConversation ? (
          <ConversationsList />
        ) : (
          <ChatArea />
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="h-screen flex bg-white">
      <div className="w-1/3 border-r border-gray-200">
        <ConversationsList />
      </div>
      <div className="flex-1">
        {activeConversation ? (
          <ChatArea />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}