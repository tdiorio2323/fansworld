import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import { MediaTile } from "@/components/MediaTile";
import { SubscriptionButton, TipButton } from "@/components/PaymentButtons";
import { PaymentVerifier } from "@/components/PaymentVerifier";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="lg:pl-64 pb-20 lg:pb-0">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="card-luxury p-8">
              <CardContent className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading creator profile...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !creatorProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="lg:pl-64 pb-20 lg:pb-0">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="card-luxury p-8 max-w-md">
              <CardContent className="flex flex-col items-center space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <h2 className="text-xl font-semibold">Creator Not Found</h2>
                <p className="text-muted-foreground text-center">
                  The creator profile you're looking for doesn't exist or has been removed.
                </p>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
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
    <div className="min-h-screen bg-background">
      <PaymentVerifier />
      <Navbar />
      
      <div className="lg:pl-64 pb-20 lg:pb-0">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-luxury">
          {/* Using gradient as placeholder since we don't have cover images in DB yet */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Header */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 ring-4 ring-background">
                  <AvatarImage src={creatorProfile.avatar_url || undefined} alt={creatorProfile.display_name || creatorProfile.username} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-4xl">
                    {(creatorProfile.display_name || creatorProfile.username)[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {creatorProfile.role === 'creator' && (
                  <div className="absolute -top-2 -right-2">
                    <Crown className="w-8 h-8 text-amber-400" />
                  </div>
                )}
                
                {creatorProfile.is_creator_verified && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
                )}
              </div>
              
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                    {creatorProfile.display_name || creatorProfile.username}
                  </h1>
                  {creatorProfile.is_creator_verified && (
                    <Verified className="w-7 h-7 text-primary flex-shrink-0" />
                  )}
                </div>
                
                <p className="text-muted-foreground text-lg mb-2">@{creatorProfile.username}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span>📅 Joined {formatDate(creatorProfile.created_at)}</span>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  {creatorProfile.role === 'creator' && (
                    <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                      Creator
                    </Badge>
                  )}
                  {creatorProfile.is_creator_verified && (
                    <Badge variant="outline" className="text-primary border-primary/30">
                      Verified
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {creatorStats.posts.toLocaleString()} posts
                  </Badge>
                  <Badge variant="secondary">
                    {creatorStats.subscribers.toLocaleString()} subscribers
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                variant={isFollowing ? "secondary" : "outline"}
                onClick={handleFollow}
                className="flex-1 sm:flex-none"
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
                  className="flex-1 sm:flex-none"
                />
              )}
              
              <TipButton
                creatorId={creatorProfile.user_id}
                creatorName={creatorProfile.display_name || creatorProfile.username}
                className="flex-1 sm:flex-none"
              />
              
              <Button variant="outline" size="icon">
                <MessageCircle className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <Share className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bio */}
          {creatorProfile.bio && (
            <div className="mb-8">
              <div className="card-luxury max-w-4xl">
                <pre className="whitespace-pre-wrap text-foreground font-sans">
                  {creatorProfile.bio}
                </pre>
              </div>
            </div>
          )}

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                All Posts ({creatorContent.length})
              </TabsTrigger>
              <TabsTrigger value="free" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Free Content ({freeContent.length})
              </TabsTrigger>
              <TabsTrigger value="premium" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Premium ({premiumContent.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {creatorContent.map((content) => (
                  <MediaTile
                    key={content.id}
                    id={content.id}
                    type={content.content_type as "image" | "video"}
                    src={content.file_url || ""}
                    title={content.title}
                    isLocked={content.is_premium || false}
                    price={content.price || 0}
                    size="medium"
                    className="transform hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
              {creatorContent.length === 0 && (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No content yet</h3>
                  <p className="text-muted-foreground">
                    This creator hasn't posted any content yet.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="free" className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {freeContent.map((content) => (
                  <MediaTile
                    key={content.id}
                    id={content.id}
                    type={content.content_type as "image" | "video"}
                    src={content.file_url || ""}
                    title={content.title}
                    isLocked={false}
                    price={0}
                    size="medium"
                    className="transform hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
              {freeContent.length === 0 && (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No free content available</h3>
                  <p className="text-muted-foreground">
                    This creator hasn't posted any free content yet.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="premium" className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {premiumContent.map((content) => (
                  <MediaTile
                    key={content.id}
                    id={content.id}
                    type={content.content_type as "image" | "video"}
                    src={content.file_url || ""}
                    title={content.title}
                    isLocked={!isSubscribed}
                    price={content.price || 0}
                    size="medium"
                    className="transform hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
              {premiumContent.length === 0 && (
                <div className="text-center py-12">
                  <Crown className="w-16 h-16 mx-auto text-amber-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No premium content</h3>
                  <p className="text-muted-foreground">
                    This creator hasn't posted any premium content yet.
                  </p>
                </div>
              )}
              {!isSubscribed && premiumContent.length > 0 && creatorProfile.subscription_price && (
                <div className="text-center py-12">
                  <div className="card-glass max-w-md mx-auto p-8">
                    <Crown className="w-16 h-16 mx-auto text-amber-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                    <p className="text-muted-foreground mb-6">
                      Subscribe to unlock exclusive content from {creatorProfile.display_name || creatorProfile.username}
                    </p>
                    <Button onClick={handleSubscribe} className="btn-luxury">
                      Subscribe ${creatorProfile.subscription_price}/mo
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}