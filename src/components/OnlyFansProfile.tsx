import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Crown,
  Star,
  Gift,
  Lock,
  Play,
  Image as ImageIcon,
  Users,
  Calendar,
  DollarSign,
  Zap,
  Bell,
  BellOff
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatorProfileProps {
  creator: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    cover_image?: string;
    bio: string;
    location?: string;
    is_verified: boolean;
    is_online: boolean;
    last_seen?: string;
    stats: {
      posts: number;
      subscribers: number;
      likes: number;
      media_count: number;
    };
    subscription: {
      price: number;
      currency: string;
      discount?: {
        percentage: number;
        expires_at: string;
      };
    };
    social_links?: {
      twitter?: string;
      instagram?: string;
      tiktok?: string;
    };
  };
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  onMessage?: () => void;
  onTip?: () => void;
}

export default function OnlyFansProfile({ 
  creator, 
  isSubscribed = false, 
  onSubscribe, 
  onMessage, 
  onTip 
}: CreatorProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedTab, setSelectedTab] = useState('posts');

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getDiscountPrice = () => {
    if (creator.subscription.discount) {
      const discountAmount = creator.subscription.price * (creator.subscription.discount.percentage / 100);
      return creator.subscription.price - discountAmount;
    }
    return creator.subscription.price;
  };

  // Mock content data
  const mockContent = [
    {
      id: '1',
      type: 'image',
      preview: '/lovable-uploads/bc97ee21-392d-4e4d-8117-27a47a8bed40.png',
      is_locked: !isSubscribed,
      likes: 234,
      comments: 12,
      price: isSubscribed ? 0 : 999,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'video',
      preview: '/lovable-uploads/de7e1d60-97a9-4b0d-af11-8f17740ed2ea.png',
      is_locked: true,
      likes: 189,
      comments: 8,
      price: 1499,
      duration: '2:34',
      created_at: '2024-01-15T08:15:00Z'
    },
    {
      id: '3',
      type: 'image',
      preview: '/lovable-uploads/fcb70729-3e74-4ee6-8e5a-c5e0811dfbff.png',
      is_locked: false,
      likes: 456,
      comments: 23,
      price: 0,
      created_at: '2024-01-14T16:45:00Z'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-pink-500 to-purple-600 overflow-hidden">
        {creator.cover_image && (
          <img 
            src={creator.cover_image} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Profile Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="sm" className="bg-white/90 text-black hover:bg-white">
            <Share className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" className="bg-white/90 text-black hover:bg-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-4 -mt-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarImage src={creator.avatar_url} alt={creator.display_name} />
                <AvatarFallback className="text-2xl">
                  {creator.display_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              {creator.is_online && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 md:ml-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {creator.display_name}
                  </h1>
                  {creator.is_verified && (
                    <Crown className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
                
                <div className="text-gray-600 mb-1">@{creator.username}</div>
                
                {creator.location && (
                  <div className="text-sm text-gray-500 mb-2">{creator.location}</div>
                )}
                
                <p className="text-gray-700 mb-4">{creator.bio}</p>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCount(creator.stats.posts)}
                    </div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCount(creator.stats.subscribers)}
                    </div>
                    <div className="text-sm text-gray-500">Fans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCount(creator.stats.likes)}
                    </div>
                    <div className="text-sm text-gray-500">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCount(creator.stats.media_count)}
                    </div>
                    <div className="text-sm text-gray-500">Media</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {!isSubscribed ? (
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={onSubscribe}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Subscribe
                      {creator.subscription.discount ? (
                        <div className="ml-2 flex items-center gap-1">
                          <span className="line-through text-xs opacity-75">
                            {formatPrice(creator.subscription.price)}
                          </span>
                          <span className="font-bold">
                            {formatPrice(getDiscountPrice())}
                          </span>
                        </div>
                      ) : (
                        <span className="ml-2 font-bold">
                          {formatPrice(creator.subscription.price)}
                        </span>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      {isFollowing ? (
                        <>
                          <Heart className="w-4 h-4 mr-2 fill-current text-red-500" />
                          Following
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={onMessage}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  
                  <Button variant="outline" onClick={onTip}>
                    <Gift className="w-4 h-4 mr-2" />
                    Tip
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  >
                    {notificationsEnabled ? (
                      <Bell className="w-4 h-4" />
                    ) : (
                      <BellOff className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-4 mt-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4 bg-white">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Live
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative">
                      <img 
                        src={content.preview} 
                        alt="Content preview"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Content Type Indicator */}
                      {content.type === 'video' && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                          {content.duration}
                        </div>
                      )}
                      
                      {/* Lock Overlay */}
                      {content.is_locked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Lock className="w-6 h-6 mx-auto mb-1" />
                            <div className="text-xs">
                              {content.price > 0 ? formatPrice(content.price) : 'Subscribe'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Engagement Stats */}
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-xs">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {content.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {content.comments}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <div className="text-center py-12">
                <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No videos yet</p>
              </div>
            </TabsContent>

            <TabsContent value="live" className="mt-6">
              <div className="text-center py-12">
                <Zap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No live streams</p>
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">About {creator.display_name}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-gray-700">{creator.bio}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Joined</h4>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>January 2024</span>
                    </div>
                  </div>
                  
                  {creator.location && (
                    <div>
                      <h4 className="font-medium mb-2">Location</h4>
                      <p className="text-gray-700">{creator.location}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-2">Subscription</h4>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatPrice(creator.subscription.price)}/month</span>
                      {creator.subscription.discount && (
                        <Badge variant="secondary" className="text-xs">
                          {creator.subscription.discount.percentage}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}