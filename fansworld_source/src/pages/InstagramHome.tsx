import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Home,
  Search,
  Plus,
  Play,
  User,
  Heart, 
  MessageCircle,
  Eye,
  Share,
  Bookmark,
  MoreHorizontal,
  Lock,
  Crown,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
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

// Add holographic animation styles
const holographicStyles = `
  @keyframes holographic {
    0% { background-position: 0% 50%, 100% 50%, 50% 0%, 50% 100%, 50% 50%, center; }
    25% { background-position: 100% 50%, 0% 50%, 50% 100%, 50% 0%, 75% 25%, center; }
    50% { background-position: 0% 50%, 100% 50%, 50% 0%, 50% 100%, 25% 75%, center; }
    75% { background-position: 100% 50%, 0% 50%, 50% 100%, 50% 0%, 75% 25%, center; }
    100% { background-position: 0% 50%, 100% 50%, 50% 0%, 50% 100%, 50% 50%, center; }
  }
  .holographic-bg {
    animation: holographic 8s ease-in-out infinite;
  }
`;

export default function InstagramHome() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for feed posts
  useEffect(() => {
    const mockPosts: FeedPost[] = [
      {
        id: '1',
        creator: {
          id: '1',
          username: 'sophia_rose',
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
          likes: 2547,
          comments: 189,
          views: 12800,
          is_liked: false,
          is_bookmarked: false
        },
        pricing: {
          amount: 1999,
          currency: 'USD'
        },
        created_at: '2024-01-15T10:30:00Z',
        is_purchased: false
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
    return `${(amount / 100).toFixed(2)}`;
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  return (
    <>
      <style>{holographicStyles}</style>
      <div className="min-h-screen" style={{
        backgroundImage: 'url(/cabana-crystal-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Prismatic glass overlay */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 85% 25%, rgba(255, 105, 180, 0.15) 0%, transparent 45%),
            radial-gradient(circle at 25% 85%, rgba(221, 160, 221, 0.15) 0%, transparent 45%),
            radial-gradient(circle at 75% 75%, rgba(255, 182, 193, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
            linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, transparent 25%, rgba(255, 192, 203, 0.05) 50%, transparent 75%)
          `,
          backdropFilter: 'blur(0.5px)'
        }}></div>
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Top Navigation */}
        <div className="relative z-10 pt-4">
          <div className="flex justify-center mb-6">
            <div className="flex gap-4">
              {['SCENES', 'TUNEUP', 'BLOG', 'PR TIP', 'PR TIP'].map((label, index) => (
                <Button
                  key={index}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 via-amber-300 to-orange-400 text-xs font-bold text-white shadow-lg hover:scale-105 transition-transform"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-4 max-w-lg mx-auto">
          {/* Feed Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-2xl overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <Link to={`/creator/${post.creator.username}`}>
                      <Avatar className="w-10 h-10 ring-2 ring-gray-600">
                        <AvatarImage src={post.creator.avatar_url} alt={post.creator.display_name} />
                        <AvatarFallback>{post.creator.display_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link to={`/creator/${post.creator.username}`} className="font-semibold text-sm text-white hover:underline">
                          {post.creator.display_name}
                        </Link>
                        {post.creator.is_verified && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                        {post.creator.subscription_tier === 'premium' && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-purple-600">
                            <Zap className="w-3 h-3 mr-1" />
                            VIP
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>@{post.creator.username}</span>
                        <span>•</span>
                        <span>{timeAgo(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post Content */}
                {post.content.text && (
                  <div className="px-4 pb-3">
                    <p className="text-sm text-white">{post.content.text}</p>
                  </div>
                )}

                {/* Media Content */}
                <div className="relative">
                  {post.content.images && post.content.images.length > 0 && (
                    <div className="aspect-square bg-gray-800 relative overflow-hidden">
                      <img 
                        src={post.content.images[0]} 
                        alt="Post content"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Paid content overlay */}
                      {post.content.type === 'paid' && !post.is_purchased && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center text-white">
                            <Lock className="w-8 h-8 mx-auto mb-2" />
                            <div className="font-semibold">Unlock for {formatPrice(post.pricing?.amount || 0)}</div>
                            <Button className="mt-3 bg-purple-600 text-white hover:bg-purple-700">
                              Purchase
                            </Button>
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
                          "p-0 h-auto hover:bg-transparent text-white",
                          post.engagement.is_liked && "text-red-500"
                        )}
                      >
                        <Heart className={cn("w-6 h-6", post.engagement.is_liked && "fill-current")} />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent text-white">
                        <MessageCircle className="w-6 h-6" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent text-white">
                        <Share className="w-6 h-6" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(post.id)}
                      className="p-0 h-auto hover:bg-transparent text-white"
                    >
                      <Bookmark className={cn("w-6 h-6", post.engagement.is_bookmarked && "fill-current")} />
                    </Button>
                  </div>

                  <div className="space-y-1 text-sm text-white">
                    <div className="font-semibold">
                      {post.engagement.likes.toLocaleString()} likes
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span>{post.engagement.views.toLocaleString()} views</span>
                    </div>
                    {post.engagement.comments > 0 && (
                      <button className="text-gray-400 hover:underline">
                        View all {post.engagement.comments} comments
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-gray-800">
          <div className="flex items-center justify-around py-3">
            {[
              { icon: Home, label: 'Home', path: '/home', active: true },
              { icon: Search, label: 'Search', path: '/search', active: false },
              { icon: Plus, label: 'Create', path: '/create', active: false },
              { icon: Play, label: 'Reels', path: '/reels', active: false },
              { icon: User, label: 'Profile', path: '/profile', active: false, highlight: true },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center p-2 transition-all duration-200",
                    item.active ? "text-white" : "text-gray-500",
                    item.highlight && "text-red-500"
                  )}
                >
                  <Icon className={cn("w-6 h-6", item.active && "fill-current")} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}