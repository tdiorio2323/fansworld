import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import InstagramNavbar from "@/components/InstagramNavbar";
import InstagramStories from "@/components/InstagramStories";
import InstagramFeed from "@/components/InstagramFeed";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  Sparkles, 
  Crown, 
  Heart, 
  MessageSquare,
  DollarSign,
  Users,
  Calendar
} from "lucide-react";

interface SuggestedCreator {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  is_verified: boolean;
  subscriber_count: number;
  subscription_price: number;
  is_online: boolean;
  bio: string;
}

export default function InstagramHome() {
  const { user } = useAuth();
  const [suggestedCreators, setSuggestedCreators] = useState<SuggestedCreator[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for suggested creators
  useEffect(() => {
    const mockSuggestions: SuggestedCreator[] = [
      {
        id: '1',
        username: 'sophia_luxury',
        display_name: 'Sophia Rose',
        avatar_url: '/lovable-uploads/2db52d3c-95ff-4d97-9f88-8201d599afdf.png',
        is_verified: true,
        subscriber_count: 12500,
        subscription_price: 1999,
        is_online: true,
        bio: 'Luxury lifestyle & exclusive content ✨'
      },
      {
        id: '2',
        username: 'luna_model',
        display_name: 'Luna Belle',
        avatar_url: '/lovable-uploads/bf0fcf1a-8488-4afa-b9ae-463c6a03c31c.png',
        is_verified: true,
        subscriber_count: 8900,
        subscription_price: 1499,
        is_online: false,
        bio: 'Fashion model & content creator 💫'
      },
      {
        id: '3',
        username: 'alex_fit',
        display_name: 'Alex Fitness',
        avatar_url: '/lovable-uploads/cb53b74b-f714-4e45-a399-b61b2f3de84f.png',
        is_verified: true,
        subscriber_count: 15600,
        subscription_price: 999,
        is_online: true,
        bio: 'Fitness motivation & workout tips 💪'
      }
    ];

    setTimeout(() => {
      setSuggestedCreators(mockSuggestions);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const formatSubscriberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <InstagramNavbar />
      
      {/* Main Content */}
      <div className="pt-16 pb-20 lg:pl-64 lg:pt-0 lg:pb-0">
        <div className="max-w-2xl mx-auto lg:max-w-6xl">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2">
              {/* Stories Section */}
              <div className="mb-6">
                <InstagramStories />
              </div>

              {/* Feed */}
              <InstagramFeed />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* User Profile Card */}
                <Card className="p-6 border-0 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 ring-2 ring-gray-100">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
                      <AvatarFallback>
                        {user?.user_metadata?.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">
                        {user?.user_metadata?.display_name || 'Welcome'}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{user?.user_metadata?.username || 'username'}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>1.2K</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>5.8K</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>$486</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Suggested Creators */}
                <Card className="p-6 border-0 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Suggested for you</h3>
                    <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                      See All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {suggestedCreators.map((creator) => (
                      <div key={creator.id} className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={creator.avatar_url} alt={creator.display_name} />
                            <AvatarFallback>{creator.display_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {creator.is_online && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm truncate">
                              {creator.display_name}
                            </span>
                            {creator.is_verified && (
                              <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {formatSubscriberCount(creator.subscriber_count)} subscribers
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatPrice(creator.subscription_price)}/month
                          </div>
                        </div>
                        
                        <Button size="sm" variant="outline" className="text-xs px-3 py-1">
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Trending Topics */}
                <Card className="p-6 border-0 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold text-gray-900">Trending</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { tag: '#LuxuryLifestyle', posts: '12.5K' },
                      { tag: '#ExclusiveContent', posts: '8.9K' },
                      { tag: '#BehindTheScenes', posts: '6.2K' },
                      { tag: '#VIPAccess', posts: '4.1K' },
                      { tag: '#CreatorLife', posts: '3.8K' }
                    ].map((trend) => (
                      <div key={trend.tag} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{trend.tag}</div>
                          <div className="text-xs text-gray-500">{trend.posts} posts</div>
                        </div>
                        <Sparkles className="w-4 h-4 text-purple-500" />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card className="p-6 border-0 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Activity</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">127</div>
                      <div className="text-xs text-gray-500">Posts Liked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">43</div>
                      <div className="text-xs text-gray-500">Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">18</div>
                      <div className="text-xs text-gray-500">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">$89</div>
                      <div className="text-xs text-gray-500">Spent</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}