import { useState } from "react";
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  DollarSign, 
  Crown,
  Image,
  Video,
  MoreVertical,
  Phone,
  VideoIcon,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";

interface Conversation {
  id: string;
  user: {
    username: string;
    displayName: string;
    avatar: string;
    isOnline: boolean;
    isPremium: boolean;
    isVerified: boolean;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
    isPaid: boolean;
    price?: number;
  };
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isSent: boolean;
  isPaid: boolean;
  price?: number;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
}

const conversations: Conversation[] = [
  {
    id: "1",
    user: {
      username: "tyler_fan",
      displayName: "Tyler D",
      avatar: "/placeholder-avatar.jpg",
      isOnline: true,
      isPremium: true,
      isVerified: false
    },
    lastMessage: {
      content: "Hey! Love your content ❤️",
      timestamp: "2 min ago",
      isRead: false,
      isPaid: false
    },
    unreadCount: 2
  },
  {
    id: "2",
    user: {
      username: "sarah_supporter",
      displayName: "Sarah M",
      avatar: "/placeholder-avatar.jpg",
      isOnline: false,
      isPremium: false,
      isVerified: false
    },
    lastMessage: {
      content: "Can't wait for your next post!",
      timestamp: "1 hour ago",
      isRead: true,
      isPaid: false
    },
    unreadCount: 0
  },
  {
    id: "3",
    user: {
      username: "premium_fan",
      displayName: "Alex Premium",
      avatar: "/placeholder-avatar.jpg",
      isOnline: true,
      isPremium: true,
      isVerified: true
    },
    lastMessage: {
      content: "Exclusive content request 💎",
      timestamp: "3 hours ago",
      isRead: true,
      isPaid: true,
      price: 25.00
    },
    unreadCount: 0
  }
];

const sampleMessages: Message[] = [
  {
    id: "1",
    content: "Hey! I'm a huge fan of your work ❤️",
    timestamp: "10:30 AM",
    isSent: false,
    isPaid: false,
    type: 'text'
  },
  {
    id: "2",
    content: "Thank you so much! That means the world to me 💕",
    timestamp: "10:32 AM",
    isSent: true,
    isPaid: false,
    type: 'text'
  },
  {
    id: "3",
    content: "Could I request some custom content? I'm willing to pay premium 💎",
    timestamp: "10:35 AM",
    isSent: false,
    isPaid: true,
    price: 50.00,
    type: 'text'
  },
  {
    id: "4",
    content: "Absolutely! Let me create something special for you ✨",
    timestamp: "10:37 AM",
    isSent: true,
    isPaid: false,
    type: 'text'
  }
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [messageText, setMessageText] = useState("");
  const [isPaidMessage, setIsPaidMessage] = useState(false);
  const [messagePrice, setMessagePrice] = useState("5.00");
  const [searchQuery, setSearchQuery] = useState("");

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // Handle sending message logic here
    console.log({
      content: messageText,
      isPaid: isPaidMessage,
      price: isPaidMessage ? parseFloat(messagePrice) : undefined
    });
    
    setMessageText("");
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="lg:pl-64 pb-20 lg:pb-0 h-screen">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full md:w-80 lg:w-96 border-r border-border bg-card">
            <div className="p-4 border-b border-border">
              <h1 className="text-2xl font-bold text-gradient mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-secondary/70' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.user.avatar} />
                        <AvatarFallback>{conversation.user.displayName[0]}</AvatarFallback>
                      </Avatar>
                      {conversation.user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{conversation.user.displayName}</h3>
                        {conversation.user.isPremium && (
                          <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.isPaid && "💎 "}
                          {conversation.lastMessage.content}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessage.timestamp}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="bg-primary">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {currentConversation ? (
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={currentConversation.user.avatar} />
                        <AvatarFallback>{currentConversation.user.displayName[0]}</AvatarFallback>
                      </Avatar>
                      {currentConversation.user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold">{currentConversation.user.displayName}</h2>
                        {currentConversation.user.isPremium && (
                          <Crown className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {currentConversation.user.isOnline ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <VideoIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Info className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {sampleMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.isSent
                          ? 'bg-primary text-primary-foreground'
                          : message.isPaid
                          ? 'bg-gradient-luxury text-white border border-primary/30'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {message.isPaid && !message.isSent && (
                        <div className="flex items-center gap-2 mb-2 text-xs font-medium">
                          <DollarSign className="w-3 h-3" />
                          Premium Message - ${message.price}
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-card">
                {/* Paid Message Toggle */}
                <div className="flex items-center gap-4 mb-3 p-3 bg-secondary/30 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="paid-message"
                      checked={isPaidMessage}
                      onCheckedChange={setIsPaidMessage}
                    />
                    <Label htmlFor="paid-message" className="text-sm font-medium">
                      Paid Message
                    </Label>
                  </div>
                  
                  {isPaidMessage && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <Input
                        type="number"
                        value={messagePrice}
                        onChange={(e) => setMessagePrice(e.target.value)}
                        className="w-20 h-8 text-sm"
                        min="1"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Image className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      className={isPaidMessage ? 'btn-luxury' : 'btn-glass'}
                      disabled={!messageText.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}