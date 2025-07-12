import { useState } from "react";
import { ArrowRight, Star, TrendingUp, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { CreatorCard } from "@/components/CreatorCard";
import { MediaTile } from "@/components/MediaTile";

// Mock data for featured creators
const featuredCreators = [
  {
    username: "lilu_f",
    displayName: "Lilu ✨",
    bio: "Content creator sharing my lifestyle and exclusive moments. Join my world! 💎",
    avatar: "/placeholder-avatar.jpg",
    isVerified: true,
    isPremium: true,
    subscriberCount: 125000,
    postCount: 342,
    subscriptionPrice: 12.99
  },
  {
    username: "olivia_b",
    displayName: "Olivia 💖 #1 Blonde on...",
    bio: "Your favorite blonde creator with exclusive content and daily updates 💫",
    avatar: "/placeholder-avatar.jpg",
    isVerified: true,
    subscriberCount: 89000,
    postCount: 256,
    subscriptionPrice: 9.99
  },
  {
    username: "milky_di",
    displayName: "Milky Di ✨",
    bio: "Sweet and spicy content creator. New posts daily! Subscribe for exclusive access 🔥",
    avatar: "/placeholder-avatar.jpg",
    isVerified: true,
    subscriberCount: 67000,
    postCount: 189,
    subscriptionPrice: 14.99
  }
];

// Mock data for trending content
const trendingContent = [
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
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="fan" username="Tyler" />
      
      {/* Main Content */}
      <div className="lg:pl-64 pb-20 lg:pb-0">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-holo">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-crystal opacity-40" />
          <div className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Welcome to
                <span className="block text-holographic">FansWorld</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Discover exclusive content from your favorite creators. 
                Join a premium community where creativity meets luxury.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button size="lg" className="btn-holographic text-lg px-8 py-4">
                  Start Exploring
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="btn-chrome text-lg px-8 py-4">
                  Become a Creator
                </Button>
              </div>

              {/* Search Bar */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-4 pr-4 py-6 text-lg glass-morphism text-white placeholder:text-white/60 focus:ring-2 focus:ring-holo-pink/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-6 h-6 text-holo-gold drop-shadow-lg" />
              <h2 className="text-3xl font-bold text-champagne">Featured Creators</h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Discover the most popular creators on FansWorld
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {featuredCreators.map((creator) => (
              <CreatorCard
                key={creator.username}
                {...creator}
                className="transform hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>

        {/* Trending Content */}
        <div className="px-4 py-16 sm:px-6 lg:px-8 bg-secondary/20">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-holo-pink" />
              <h2 className="text-3xl font-bold text-holographic">Trending Now</h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Hot content from across the platform
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {trendingContent.map((content) => (
              <MediaTile
                key={content.id}
                {...content}
                size="medium"
                className="transform hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="card-crystal p-6">
              <div className="text-3xl font-bold text-holographic mb-2">100K+</div>
              <div className="text-muted-foreground">Active Creators</div>
            </div>
            <div className="card-crystal p-6">
              <div className="text-3xl font-bold text-champagne mb-2">5M+</div>
              <div className="text-muted-foreground">Premium Subscribers</div>
            </div>
            <div className="card-crystal p-6">
              <div className="text-3xl font-bold text-holographic mb-2">50M+</div>
              <div className="text-muted-foreground">Content Pieces</div>
            </div>
            <div className="card-crystal p-6">
              <div className="text-3xl font-bold text-champagne mb-2">$10M+</div>
              <div className="text-muted-foreground">Creator Earnings</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-champagne relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-crystal opacity-30" />
          <div className="text-center text-white relative z-10">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-holo-gold drop-shadow-lg" />
            <h2 className="text-4xl font-bold mb-6 text-holographic">
              Ready to Join the Premium Experience?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Start your journey today and discover exclusive content from the world's most talented creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-holographic text-lg px-8 py-4">
                Sign Up Free
              </Button>
              <Button variant="outline" size="lg" className="btn-chrome text-lg px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}