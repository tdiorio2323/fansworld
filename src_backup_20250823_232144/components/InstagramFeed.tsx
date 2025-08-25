import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MoreHorizontal, 
  Eye,
  Lock,
  Crown,
  Zap,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface FeedPost {
  id: string;
  creator: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    is_verified: boolean;
    subscription_tier?: string;
  };
  content: {
    text?: string;
    images?: string[];
    video?: string;
    type: 'free' | 'paid' | 'subscriber_only';
  };
  engagement: {
    likes: number;
    comments: number;
    views: number;
    is_liked: boolean;
    is_bookmarked: boolean;
  };
  pricing?: {
    amount: number;
    currency: string;
  };
  created_at: string;
  is_purchased?: boolean;
}

export default function InstagramFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real API call
  useEffect(() => {
    const mockPosts: FeedPost[] = [
      {
        id: '1',
        creator: {
          id: '1',
          username: 'sophia_luxury',
          display_name: 'Sophia Rose',
          avatar_url: '/lovable-uploads/2db52d3c-95ff-4d97-9f88-8201d599afdf.png',
          is_verified: true,
          subscription_tier: 'premium'
        },
        content: {
          text: 'New exclusive content just dropped! 🔥✨ Only for my VIP subscribers',
          images: ['/lovable-uploads/bc97ee21-392d-4e4d-8117-27a47a8bed40.png'],
          type: 'paid'
        },
        engagement: {
          likes: 234,
          comments: 45,
          views: 1200,
          is_liked: false,
          is_bookmarked: false
        },
        pricing: {
          amount: 1999,
          currency: 'USD'
        },
        created_at: '2024-01-15T10:30:00Z',
        is_purchased: false
      },
      {
        id: '2',
        creator: {
          id: '2',
          username: 'alex_fit',
          display_name: 'Alex Fitness',
          avatar_url: '/lovable-uploads/cb53b74b-f714-4e45-a399-b61b2f3de84f.png',
          is_verified: true
        },
        content: {
          text: 'Good morning! Starting the day with some motivation 💪',
          images: ['/lovable-uploads/de7e1d60-97a9-4b0d-af11-8f17740ed2ea.png'],
          type: 'free'
        },
        engagement: {
          likes: 156,
          comments: 23,
          views: 890,
          is_liked: true,
          is_bookmarked: true
        },
        created_at: '2024-01-15T08:15:00Z'
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            engagement: { 
              ...post.engagement, 
              is_liked: !post.engagement.is_liked,
              likes: post.engagement.is_liked ? post.engagement.likes - 1 : post.engagement.likes + 1
            }
          }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            engagement: { 
              ...post.engagement, 
              is_bookmarked: !post.engagement.is_bookmarked
            }
          }
        : post
    ));
  };

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden border-0 shadow-sm">
          {/* Post Header */}
          <div className="flex items-center justify-between p-4 pb-3">
            <div className="flex items-center gap-3">
              <Link to={`/creator/${post.creator.username}`}>
                <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                  <AvatarImage src={post.creator.avatar_url} alt={post.creator.display_name} />
                  <AvatarFallback>{post.creator.display_name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/creator/${post.creator.username}`} className="font-semibold text-sm hover:underline">
                    {post.creator.display_name}
                  </Link>
                  {post.creator.is_verified && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                  {post.creator.subscription_tier === 'premium' && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      <Zap className="w-3 h-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>@{post.creator.username}</span>
                  <span>•</span>
                  <span>{timeAgo(post.created_at)}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Post Content */}
          {post.content.text && (
            <div className="px-4 pb-3">
              <p className="text-sm">{post.content.text}</p>
            </div>
          )}

          {/* Media Content */}
          <div className="relative">
            {post.content.images && post.content.images.length > 0 && (
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img 
                  src={post.content.images[0]} 
                  alt="Post content"
                  className="w-full h-full object-cover"
                />
                
                {/* Paid content overlay */}
                {post.content.type === 'paid' && !post.is_purchased && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center text-white">
                      <Lock className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-semibold">Unlock for {formatPrice(post.pricing?.amount || 0)}</div>
                      <Button className="mt-3 bg-white text-black hover:bg-gray-100">
                        Purchase
                      </Button>
                    </div>
                  </div>
                )}

                {/* Video overlay */}
                {post.content.video && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Engagement Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "p-0 h-auto hover:bg-transparent",
                    post.engagement.is_liked && "text-red-500"
                  )}
                >
                  <Heart className={cn("w-6 h-6", post.engagement.is_liked && "fill-current")} />
                </Button>
                <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                  <MessageCircle className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                  <Share className="w-6 h-6" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBookmark(post.id)}
                className="p-0 h-auto hover:bg-transparent"
              >
                <Bookmark className={cn("w-6 h-6", post.engagement.is_bookmarked && "fill-current")} />
              </Button>
            </div>

            <div className="space-y-1 text-sm">
              <div className="font-semibold">
                {post.engagement.likes.toLocaleString()} likes
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{post.engagement.views.toLocaleString()} views</span>
              </div>
              {post.engagement.comments > 0 && (
                <button className="text-gray-500 hover:underline">
                  View all {post.engagement.comments} comments
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}