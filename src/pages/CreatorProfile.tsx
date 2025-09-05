import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Crown, 
  Verified, 
  Settings, 
  MoreHorizontal,
  Plus,
  Grid3X3,
  Play,
  Camera,
  DollarSign,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Users,
  Calendar,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MediaTile } from "@/components/MediaTile";
import { SubscriptionButton, TipButton } from "@/components/PaymentButtons";
import { PaymentVerifier } from "@/components/PaymentVerifier";
import { supabase } from '@/integrations/supabase/supabase';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { KarolProfile } from "./creator/KarolProfile";

interface CreatorProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_creator_verified: boolean | null;
  subscription_price: number | null;
  role: string | null;
  created_at: string;
}

interface CreatorContent {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  file_url: string | null;
  is_premium: boolean | null;
  price: number | null;
  created_at: string;
}

interface CreatorStats {
  posts: number;
  subscribers: number;
  subscriptionPrice: number;
}

export default function CreatorProfile() {
  const { username } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  // Special handling for Karol's OCR-extracted profile
  if (username === 'karol') {
    return <KarolProfile />;
  }
  
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [creatorContent, setCreatorContent] = useState<CreatorContent[]>([]);
  const [creatorStats, setCreatorStats] = useState<CreatorStats>({
    posts: 0,
    subscribers: 0,
    subscriptionPrice: 0
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      loadCreatorData();
    }
  }, [username, user]);

  const loadCreatorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load creator profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) {
        throw new Error('Creator not found');
      }

      setCreatorProfile(profile);

      // Load creator content
      const { data: content, error: contentError } = await supabase
        .from('creator_content')
        .select('*')
        .eq('creator_id', profile.user_id)
        .eq('moderation_status', 'approved') // Only show approved content
        .order('created_at', { ascending: false });

      if (contentError) {
        console.error('Error loading content:', contentError);
      } else {
        setCreatorContent(content || []);
      }

      // Load creator stats
      const { data: subscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('creator_id', profile.user_id)
        .eq('status', 'active');

      if (subsError) {
        console.error('Error loading subscriptions:', subsError);
      }

      // Check if current user is subscribed
      if (user) {
        const { data: userSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('creator_id', profile.user_id)
          .eq('subscriber_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        setIsSubscribed(!!userSub);
      }

      // Set stats
      setCreatorStats({
        posts: content?.length || 0,
        subscribers: subscriptions?.length || 0,
        subscriptionPrice: profile.subscription_price || 0
      });

    } catch (err) {
      console.error('Error loading creator data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load creator profile');
      toast({
        title: "Error",
        description: "Failed to load creator profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (error || !creatorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Creator Not Found</h2>
                        <p className="text-black mb-6">
                The creator profile you're looking for doesn't exist or has been removed.
              </p>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const freeContent = creatorContent.filter(item => !item.is_premium);
  const premiumContent = creatorContent.filter(item => item.is_premium);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PaymentVerifier />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="font-semibold text-gray-900">
                {creatorProfile.display_name || creatorProfile.username}
              </h1>
              <p className="text-xs text-gray-500">{creatorStats.posts} posts</p>
            </div>
            
            <Button variant="ghost" className="p-2">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Cover Photo Placeholder */}
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>

        {/* Profile Section */}
        <div className="relative px-4 sm:px-6 lg:px-8 -mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6">
              <div className="relative flex-shrink-0">
                <Avatar className="w-24 h-24 ring-4 ring-white">
                  <AvatarImage 
                    src={creatorProfile.avatar_url || undefined} 
                    alt={creatorProfile.display_name || creatorProfile.username} 
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-2xl">
                    {(creatorProfile.display_name || creatorProfile.username)[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {creatorProfile.is_creator_verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full border-3 border-white flex items-center justify-center">
                    <Verified className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {creatorProfile.display_name || creatorProfile.username}
                  </h2>
                  {creatorProfile.role === 'creator' && (
                    <Crown className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                
                <p className="text-gray-500 mb-3">@{creatorProfile.username}</p>

                {/* Stats */}
                <div className="flex gap-6 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{creatorStats.posts}</div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{creatorStats.subscribers.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">4.8K</div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>

                {/* Bio */}
                {creatorProfile.bio && (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {creatorProfile.bio}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(creatorProfile.created_at)}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {creatorProfile.role === 'creator' && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      Creator
                    </Badge>
                  )}
                  {creatorProfile.is_creator_verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant={isFollowing ? "secondary" : "default"}
                onClick={handleFollow}
                className={`flex-1 min-w-0 ${!isFollowing ? 'bg-gray-900 hover:bg-gray-800' : ''}`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              
              {creatorProfile.subscription_price && (
                <SubscriptionButton
                  creatorId={creatorProfile.user_id}
                  creatorName={creatorProfile.display_name || creatorProfile.username}
                  subscriptionPrice={Math.round(creatorProfile.subscription_price * 100)}
                  isSubscribed={isSubscribed}
                  className="flex-1 min-w-0"
                />
              )}
              
              <TipButton
                creatorId={creatorProfile.user_id}
                creatorName={creatorProfile.display_name || creatorProfile.username}
                className="flex-1 min-w-0"
              />
              
              <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50">
                <MessageCircle className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Content Tabs */}
        <div className="px-4 sm:px-6 lg:px-8 mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white border border-gray-200 p-1 mb-8">
              <TabsTrigger value="posts" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="free" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Free
              </TabsTrigger>
              <TabsTrigger value="premium" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Premium
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-3 gap-1"
              >
                {creatorContent.length === 0 ? (
                  <div className="col-span-3 text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500">This creator hasn't shared any content yet.</p>
                  </div>
                ) : (
                  creatorContent.map((content) => (
                    <div key={content.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group">
                      {content.file_url ? (
                        <img 
                          src={content.file_url} 
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          {content.content_type === 'video' ? (
                            <Play className="w-8 h-8 text-gray-500" />
                          ) : (
                            <Camera className="w-8 h-8 text-gray-500" />
                          )}
                        </div>
                      )}
                      
                      {content.is_premium && (
                        <div className="absolute top-2 right-2">
                          <Crown className="w-4 h-4 text-amber-400" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <h4 className="font-medium text-sm mb-1">{content.title}</h4>
                          {content.price && (
                            <p className="text-xs">${(content.price / 100).toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="free">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-3 gap-1"
              >
                {freeContent.length === 0 ? (
                  <div className="col-span-3 text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No free content</h3>
                    <p className="text-gray-500">This creator hasn't shared any free content yet.</p>
                  </div>
                ) : (
                  freeContent.map((content) => (
                    <div key={content.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      {content.file_url ? (
                        <img 
                          src={content.file_url} 
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Camera className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="premium">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-3 gap-1"
              >
                {premiumContent.length === 0 ? (
                  <div className="col-span-3 text-center py-16">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No premium content</h3>
                    <p className="text-gray-500">This creator hasn't shared any premium content yet.</p>
                  </div>
                ) : (
                  <>
                    {!isSubscribed && (
                      <div className="col-span-3 bg-white rounded-2xl border border-gray-200 p-8 text-center mb-6">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Crown className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Content</h3>
                        <p className="text-gray-600 mb-6">
                          Subscribe to unlock exclusive content from {creatorProfile.display_name || creatorProfile.username}
                        </p>
                        <Button 
                          onClick={handleSubscribe} 
                          className="bg-gray-900 hover:bg-gray-800 text-white"
                        >
                          Subscribe ${creatorProfile.subscription_price}/mo
                        </Button>
                      </div>
                    )}
                    {premiumContent.map((content) => (
                      <div key={content.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                        {content.file_url ? (
                          <img 
                            src={content.file_url} 
                            alt={content.title}
                            className={`w-full h-full object-cover ${!isSubscribed ? 'blur-md' : ''}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Crown className="w-8 h-8 text-amber-500" />
                          </div>
                        )}
                        
                        {!isSubscribed && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Crown className="w-8 h-8 text-amber-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}