import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
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
  Zap,
  Settings,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";

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

export default function InstagramHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handlePurchaseContent = (postId: string) => {
    // Update the post to mark as purchased
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, is_purchased: true }
          : post
      )
    );
    
    // Show success message
    alert('Content purchased successfully! 🎉');
  };

  const handleCommentClick = (postId: string) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
      setCommentText('');
    }
  };

  const handleSubmitComment = (postId: string) => {
    if (!commentText.trim()) return;
    
    // In a real app, this would save to database
    alert(`Comment posted: "${commentText}"`);
    setCommentText('');
    setActiveCommentPost(null);
  };

  const handleViewAllComments = (postId: string) => {
    if (showAllComments === postId) {
      setShowAllComments(null);
    } else {
      setShowAllComments(postId);
    }
  };

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Mock data for demo
  useEffect(() => {
    const mockPosts: FeedPost[] = [
      {
        id: '1',
        creator: {
          id: '1',
          username: 'elena_cabana',
          display_name: 'Elena Rodriguez',
          avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b885ca02?w=150',
          is_verified: true,
          subscription_tier: 'premium'
        },
        content: {
          text: 'Behind the scenes of today\'s photoshoot ✨ Loving this new collection!',
          images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'],
          type: 'free'
        },
        engagement: {
          likes: 2847,
          comments: 156,
          views: 8392,
          is_liked: false,
          is_bookmarked: false
        },
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        creator: {
          id: '2',
          username: 'alex_creative',
          display_name: 'Alex Chen',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          is_verified: false,
          subscription_tier: 'basic'
        },
        content: {
          text: 'Exclusive content for my VIP members! 🔥',
          images: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'],
          type: 'paid'
        },
        engagement: {
          likes: 1523,
          comments: 89,
          views: 4201,
          is_liked: true,
          is_bookmarked: true
        },
        pricing: {
          amount: 999,
          currency: 'USD'
        },
        created_at: new Date(Date.now() - 7200000).toISOString(),
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">CABANA</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => alert('Notifications feature coming soon!')}
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-md mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            <div className="flex-shrink-0 text-center">
              <button 
                className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-1 hover:scale-105 transition-transform"
                onClick={() => navigate('/create')}
              >
                <Plus className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-xs text-gray-600">Your Story</span>
            </div>
            {['Elena', 'Alex', 'Sofia', 'Marcus', 'Luna'].map((name, index) => (
              <div key={index} className="flex-shrink-0 text-center">
                <button 
                  className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-0.5 hover:scale-105 transition-transform"
                  onClick={() => navigate(`/creator/${name.toLowerCase()}_cabana`)}
                >
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  </div>
                </button>
                <span className="text-xs text-gray-600 truncate block w-16 mt-1">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {/* Feed Posts */}
        <div className="space-y-0">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-white border-0 border-b border-gray-200 rounded-none">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <Link to={`/creator/${post.creator.username}`}>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.creator.avatar_url} alt={post.creator.display_name} />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {post.creator.display_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link to={`/creator/${post.creator.username}`} className="font-semibold text-sm text-gray-900 hover:underline">
                          {post.creator.display_name}
                        </Link>
                        {post.creator.is_verified && (
                          <Crown className="w-4 h-4 text-amber-500" />
                        )}
                        {post.creator.subscription_tier === 'premium' && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-900 text-white">
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
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post Content */}
                {post.content.text && (
                  <div className="px-4 pb-3">
                    <p className="text-sm text-gray-900">{post.content.text}</p>
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
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                              <Lock className="w-8 h-8" />
                            </div>
                            <div className="font-semibold text-lg mb-2">Premium Content</div>
                            <div className="text-sm mb-4">Unlock for ${formatPrice(post.pricing?.amount || 0)}</div>
                            <Button 
                              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-6"
                              onClick={() => handlePurchaseContent(post.id)}
                            >
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
                    <div className="flex items-center gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={cn(
                          "p-0 h-auto hover:bg-transparent",
                          post.engagement.is_liked ? "text-red-500" : "text-gray-700"
                        )}
                      >
                        <Heart className={cn("w-6 h-6", post.engagement.is_liked && "fill-current")} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto hover:bg-transparent text-gray-700"
                        onClick={() => handleCommentClick(post.id)}
                      >
                        <MessageCircle className="w-6 h-6" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent text-gray-700">
                        <Share className="w-6 h-6" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(post.id)}
                      className={cn(
                        "p-0 h-auto hover:bg-transparent",
                        post.engagement.is_bookmarked ? "text-gray-900" : "text-gray-700"
                      )}
                    >
                      <Bookmark className={cn("w-6 h-6", post.engagement.is_bookmarked && "fill-current")} />
                    </Button>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="font-semibold text-gray-900">
                      {post.engagement.likes.toLocaleString()} likes
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{post.engagement.views.toLocaleString()} views</span>
                    </div>
                    {post.engagement.comments > 0 && (
                      <button 
                        className="text-gray-500 hover:text-gray-700 text-sm"
                        onClick={() => handleViewAllComments(post.id)}
                      >
                        {showAllComments === post.id ? 'Hide comments' : `View all ${post.engagement.comments} comments`}
                      </button>
                    )}
                  </div>

                  {/* Comments Display Section */}
                  {showAllComments === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-3 mt-3"
                    >
                      <div className="space-y-3">
                        {/* Sample Comments */}
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">J</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-semibold text-black">jessica_doe</span>
                              <span className="text-black ml-2">This is amazing! 🔥</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-gray-500">2h</span>
                              <button
                                onClick={() => handleLikeComment('comment-1')}
                                className={cn(
                                  "text-xs font-semibold",
                                  likedComments.has('comment-1') ? "text-red-500" : "text-gray-500 hover:text-gray-700"
                                )}
                              >
                                {likedComments.has('comment-1') ? 'Unlike' : 'Like'}
                              </button>
                              <span className="text-xs text-gray-500">Reply</span>
                            </div>
                            {likedComments.has('comment-1') && (
                              <div className="text-xs text-gray-500 mt-1">❤️ 1 like</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">M</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-semibold text-black">mike_creator</span>
                              <span className="text-black ml-2">Love the quality! ✨</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-gray-500">4h</span>
                              <button
                                onClick={() => handleLikeComment('comment-2')}
                                className={cn(
                                  "text-xs font-semibold",
                                  likedComments.has('comment-2') ? "text-red-500" : "text-gray-500 hover:text-gray-700"
                                )}
                              >
                                {likedComments.has('comment-2') ? 'Unlike' : 'Like'}
                              </button>
                              <span className="text-xs text-gray-500">Reply</span>
                            </div>
                            {likedComments.has('comment-2') && (
                              <div className="text-xs text-gray-500 mt-1">❤️ 1 like</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">S</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-semibold text-black">sarah_model</span>
                              <span className="text-black ml-2">Absolutely gorgeous! 😍</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-gray-500">6h</span>
                              <button
                                onClick={() => handleLikeComment('comment-3')}
                                className={cn(
                                  "text-xs font-semibold",
                                  likedComments.has('comment-3') ? "text-red-500" : "text-gray-500 hover:text-gray-700"
                                )}
                              >
                                {likedComments.has('comment-3') ? 'Unlike' : 'Like'}
                              </button>
                              <span className="text-xs text-gray-500">Reply</span>
                            </div>
                            {likedComments.has('comment-3') && (
                              <div className="text-xs text-gray-500 mt-1">❤️ 1 like</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Comment Input Box (Instagram-style) */}
                  {activeCommentPost === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-3 mt-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSubmitComment(post.id);
                              }
                            }}
                            className="flex-1 text-sm border-none outline-none bg-transparent placeholder:text-gray-500 text-black"
                            autoFocus
                          />
                          {commentText.trim() && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSubmitComment(post.id)}
                              className="text-blue-500 hover:text-blue-600 font-semibold text-sm h-auto p-0"
                            >
                              Post
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto flex items-center justify-around py-3">
          {[
            { icon: Home, label: 'Home', path: '/home', active: true },
            { icon: Search, label: 'Search', path: '/search', active: false },
            { icon: Plus, label: 'Create', path: '/create', active: false },
            { icon: Play, label: 'Reels', path: '/reels', active: false },
            { icon: User, label: 'Profile', path: '/profile', active: false },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-2 transition-all duration-200",
                  item.active ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className={cn("w-6 h-6", item.active && "fill-current")} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}