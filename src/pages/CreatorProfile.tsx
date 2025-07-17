import { useState } from "react";
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
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { MediaTile } from "@/components/MediaTile";

// Mock data
const creatorData = {
  username: "lilu_f",
  displayName: "Lilu ✨",
  bio: "Content creator sharing my lifestyle and exclusive moments. Join my world! 💎\n\n✨ Daily posts\n💌 Personal messages\n🔥 Exclusive content\n📸 Behind the scenes",
  avatar: "/placeholder-avatar.jpg",
  coverImage: "/placeholder-cover.jpg",
  isVerified: true,
  isPremium: true,
  isOnline: true,
  joinedDate: "March 2023",
  location: "Los Angeles, CA",
  website: "linktr.ee/lilu_f",
  
  stats: {
    posts: 342,
    subscribers: 125000,
    likes: 2800000,
    subscriptionPrice: 12.99
  }
};

const mediaContent = [
  {
    id: "1",
    type: "image" as const,
    src: "/placeholder-content1.jpg",
    title: "Summer Vibes",
    likes: 1250,
    comments: 89,
    views: 5600,
    isLocked: false
  },
  {
    id: "2",
    type: "video" as const,
    src: "/placeholder-video1.jpg",
    title: "Behind the Scenes",
    likes: 2100,
    comments: 156,
    views: 8900,
    duration: "2:34",
    isLocked: true,
    price: 4.99
  },
  {
    id: "3",
    type: "image" as const,
    src: "/placeholder-content2.jpg",
    title: "Exclusive Photoshoot",
    likes: 980,
    comments: 67,
    views: 3400,
    isLocked: true,
    price: 7.99
  },
  {
    id: "4",
    type: "video" as const,
    src: "/placeholder-video2.jpg",
    title: "Live Stream Highlights",
    likes: 3200,
    comments: 234,
    views: 12000,
    duration: "5:12",
    isLocked: false
  },
  {
    id: "5",
    type: "image" as const,
    src: "/placeholder-content3.jpg",
    title: "Workout Session",
    likes: 1800,
    comments: 143,
    views: 7200,
    isLocked: true,
    price: 3.99
  },
  {
    id: "6",
    type: "video" as const,
    src: "/placeholder-video3.jpg",
    title: "Q&A Session",
    likes: 2500,
    comments: 189,
    views: 9500,
    duration: "8:45",
    isLocked: false
  }
];

export default function CreatorProfile() {
  const { username } = useParams();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const freeContent = mediaContent.filter(item => !item.isLocked);
  const premiumContent = mediaContent.filter(item => item.isLocked);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="lg:pl-64 pb-20 lg:pb-0">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-luxury">
          <img 
            src={creatorData.coverImage} 
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Header */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 ring-4 ring-background">
                  <AvatarImage src={creatorData.avatar} alt={creatorData.displayName} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-4xl">
                    {creatorData.displayName[0]}
                  </AvatarFallback>
                </Avatar>
                
                {creatorData.isPremium && (
                  <div className="absolute -top-2 -right-2">
                    <Crown className="w-8 h-8 text-amber-400" />
                  </div>
                )}
                
                {creatorData.isOnline && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
                )}
              </div>
              
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                    {creatorData.displayName}
                  </h1>
                  {creatorData.isVerified && (
                    <Verified className="w-7 h-7 text-primary flex-shrink-0" />
                  )}
                </div>
                
                <p className="text-muted-foreground text-lg mb-2">@{creatorData.username}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span>📍 {creatorData.location}</span>
                  <span>📅 Joined {creatorData.joinedDate}</span>
                  {creatorData.isOnline && <span className="text-green-500">🟢 Online</span>}
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                    Premium Creator
                  </Badge>
                  <Badge variant="secondary">
                    {creatorData.stats.posts.toLocaleString()} posts
                  </Badge>
                  <Badge variant="secondary">
                    {creatorData.stats.subscribers.toLocaleString()} subscribers
                  </Badge>
                  <Badge variant="secondary">
                    {creatorData.stats.likes.toLocaleString()} likes
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
              
              <Button
                onClick={handleSubscribe}
                className={`btn-luxury flex-1 sm:flex-none ${isSubscribed ? 'opacity-75' : ''}`}
              >
                {isSubscribed ? (
                  <>
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Subscribed
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Subscribe ${creatorData.stats.subscriptionPrice}/mo
                  </>
                )}
              </Button>
              
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
          <div className="mb-8">
            <div className="card-luxury max-w-4xl">
              <pre className="whitespace-pre-wrap text-foreground font-sans">
                {creatorData.bio}
              </pre>
              {creatorData.website && (
                <div className="mt-4 pt-4 border-t border-border">
                  <a 
                    href={`https://${creatorData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    🔗 {creatorData.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                All Posts
              </TabsTrigger>
              <TabsTrigger value="free" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Free Content
              </TabsTrigger>
              <TabsTrigger value="premium" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Premium
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaContent.map((content) => (
                  <MediaTile
                    key={content.id}
                    {...content}
                    size="medium"
                    className="transform hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="free" className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {freeContent.map((content) => (
                  <MediaTile
                    key={content.id}
                    {...content}
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
                    Subscribe to access this creator's exclusive content
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="premium" className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {premiumContent.map((content) => (
                  <MediaTile
                    key={content.id}
                    {...content}
                    size="medium"
                    className="transform hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
              {!isSubscribed && (
                <div className="text-center py-12">
                  <div className="card-glass max-w-md mx-auto p-8">
                    <Crown className="w-16 h-16 mx-auto text-amber-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                    <p className="text-muted-foreground mb-6">
                      Subscribe to unlock exclusive content from {creatorData.displayName}
                    </p>
                    <Button onClick={handleSubscribe} className="btn-luxury">
                      Subscribe ${creatorData.stats.subscriptionPrice}/mo
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