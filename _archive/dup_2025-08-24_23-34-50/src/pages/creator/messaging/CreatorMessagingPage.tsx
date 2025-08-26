import React, { useState } from 'react';
import { Send, Search, MessageCircle, Users, Filter, Star, Pin, Archive, Trash2, MoreHorizontal, Image, Paperclip, Smile } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CreatorMessagingPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Emma Watson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c2f8b93e?w=150',
      lastMessage: 'Thank you for the amazing content! ❤️',
      timestamp: '2 min ago',
      unread: 3,
      isVip: true,
      isOnline: true
    },
    {
      id: 2,
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      lastMessage: 'When is the next live stream?',
      timestamp: '15 min ago',
      unread: 1,
      isVip: false,
      isOnline: true
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      lastMessage: 'Love your latest post!',
      timestamp: '1 hour ago',
      unread: 0,
      isVip: true,
      isOnline: false
    },
    {
      id: 4,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      lastMessage: 'Can we get a custom request?',
      timestamp: '3 hours ago',
      unread: 0,
      isVip: false,
      isOnline: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Emma Watson',
      message: 'Hi! I absolutely love your content. You\'re so creative!',
      timestamp: '10:30 AM',
      isFromUser: false
    },
    {
      id: 2,
      sender: 'You',
      message: 'Thank you so much! That means a lot to me ✨',
      timestamp: '10:32 AM',
      isFromUser: true
    },
    {
      id: 3,
      sender: 'Emma Watson',
      message: 'I was wondering if you could do a custom photo set?',
      timestamp: '10:35 AM',
      isFromUser: false
    },
    {
      id: 4,
      sender: 'You',
      message: 'Of course! I\'d be happy to create something special for you. Let me know what you have in mind!',
      timestamp: '10:37 AM',
      isFromUser: true
    },
    {
      id: 5,
      sender: 'Emma Watson',
      message: 'Thank you for the amazing content! ❤️',
      timestamp: '10:40 AM',
      isFromUser: false
    }
  ];

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-gray-600 text-lg">Connect and engage with your fans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-800">Messages</CardTitle>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-600">
                    {conversations.filter(c => c.unread > 0).length} new
                  </Badge>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="vip">VIP</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-0">
                    <div className="space-y-1">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-4 cursor-pointer transition-colors border-r-4 ${
                            selectedConversation === conversation.id
                              ? 'bg-purple-50 border-r-purple-500'
                              : 'hover:bg-gray-50 border-r-transparent'
                          }`}
                          onClick={() => setSelectedConversation(conversation.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={conversation.avatar} />
                                <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                              </Avatar>
                              {conversation.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <p className="font-semibold text-gray-900 truncate">
                                    {conversation.name}
                                  </p>
                                  {conversation.isVip && (
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  )}
                                </div>
                                {conversation.unread > 0 && (
                                  <Badge variant="default" className="bg-purple-500 text-white text-xs">
                                    {conversation.unread}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 truncate">
                                {conversation.lastMessage}
                              </p>
                              <p className="text-xs text-gray-400">{conversation.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConversationData?.avatar} />
                      <AvatarFallback>{selectedConversationData?.name[0]}</AvatarFallback>
                    </Avatar>
                    {selectedConversationData?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{selectedConversationData?.name}</h3>
                      {selectedConversationData?.isVip && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {selectedConversationData?.isOnline ? 'Online' : 'Last seen 2 hours ago'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Pin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.isFromUser
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isFromUser ? 'text-purple-100' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Image className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      disabled={!messageText.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Message Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Conversations</p>
                  <p className="text-2xl font-bold text-purple-600">247</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Response Rate</p>
                  <p className="text-2xl font-bold text-green-600">94%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
                  <Send className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">VIP Fans</p>
                  <p className="text-2xl font-bold text-yellow-600">89</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
                  <p className="text-2xl font-bold text-blue-600">12min</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorMessagingPage;