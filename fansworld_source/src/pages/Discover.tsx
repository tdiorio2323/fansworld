import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, User, Heart, Star, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { MediaTile } from "@/components/MediaTile";
import { CreatorCard } from "@/components/CreatorCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Creator {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_creator_verified: boolean | null;
  subscriber_count?: number;
  content_count?: number;
}

interface Content {
  id: string;
  title: string;
  content_type: string;
  file_url: string | null;
  creator_id: string;
  is_premium: boolean | null;
  price: number | null;
  created_at: string;
}

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [content, setContent] = useState<Content[]>([]);

  const loadCreators = async () => {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'creator')
        .limit(20);

      const { data: subscriptionCounts } = await supabase
        .from('subscriptions')
        .select('creator_id')
        .eq('status', 'active');

      const creatorsWithStats = profiles?.map(profile => {
        const subscriberCount = subscriptionCounts?.filter(s => s.creator_id === profile.user_id).length || 0;
        return {
          id: profile.id,
          username: profile.username,
          display_name: profile.display_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          is_creator_verified: profile.is_creator_verified,
          subscriber_count: subscriberCount,
          content_count: 0
        };
      }) || [];

      setCreators(creatorsWithStats);
    } catch (error) {
      console.error('Error loading creators:', error);
      toast({
        title: "Error",
        description: "Failed to load creators. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadContent = async () => {
    try {
      const { data } = await supabase
        .from('creator_content')
        .select(`
          *,
          profiles!creator_content_creator_id_fkey(username, display_name, avatar_url)
        `)
        .eq('is_premium', false)
        .order('created_at', { ascending: false })
        .limit(20);

      setContent(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadCreators(), loadContent()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = 
      creator.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-luxury font-bold text-gradient mb-4">
            Discover
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore exclusive content from verified creators and find your new favorite artists
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Creators Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Creators</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                        <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2 mx-auto mb-4"></div>
                        <div className="h-8 bg-muted rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCreators.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No creators found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms" : "No creators have joined yet"}
                </p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {filteredCreators.map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    username={creator.username}
                    displayName={creator.display_name || creator.username}
                    bio={creator.bio || ""}
                    avatar={creator.avatar_url || ""}
                    isVerified={creator.is_creator_verified || false}
                    subscriberCount={creator.subscriber_count || 0}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Featured Content</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="animate-pulse">
                      <div className="h-48 bg-muted"></div>
                      <div className="p-4">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : content.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No content available</h3>
                <p className="text-muted-foreground">
                  Check back later for new content from creators
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.map((item) => (
                  <MediaTile
                    key={item.id}
                    id={item.id}
                    type={item.content_type === 'video' ? 'video' : 'image'}
                    src={item.file_url || ''}
                    thumbnail={item.file_url || ''}
                    title={item.title}
                    isLocked={item.is_premium || false}
                    price={item.price ? item.price / 100 : undefined}
                    likes={0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}