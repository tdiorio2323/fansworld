import { useState } from "react";
import { ArrowRight, Star, TrendingUp, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
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
      <Navbar />
      
      {/* Main Content */}
      <div className="lg:pl-64 pb-20 lg:pb-0">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/lovable-uploads/cb53b74b-f714-4e45-a399-b61b2f3de84f.png')"
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
          
          {/* Luxury Accent Images */}
          <div className="absolute top-10 right-10 w-32 h-32 opacity-20 animate-float">
            <img 
              src="/lovable-uploads/de7e1d60-97a9-4b0d-af11-8f17740ed2ea.png" 
              alt="" 
              className="w-full h-full object-cover rounded-3xl blur-sm"
            />
          </div>
          <div className="absolute bottom-20 left-10 w-24 h-24 opacity-15 float-animation" style={{ animationDelay: '1s' }}>
            <img 
              src="/lovable-uploads/2db52d3c-95ff-4d97-9f88-8201d599afdf.png" 
              alt="" 
              className="w-full h-full object-cover rounded-2xl blur-sm"
            />
          </div>
          <div className="relative px-4 py-32 sm:px-6 lg:px-8">
            <div className="text-center max-w-5xl mx-auto">
              <div className="animate-fade-up">
                <h1 className="text-5xl md:text-8xl font-luxury font-bold text-white mb-8 leading-tight">
                  Enter the
                  <span className="block text-white mt-2 animate-pulse">Cabana</span>
                </h1>
              </div>
              
              <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                  Discover exclusive content from your favorite creators. 
                  Join a premium community where creativity meets luxury.
                </p>
              </div>
              
              <div className="animate-fade-up flex flex-col sm:flex-row gap-6 justify-center items-center mb-16" style={{ animationDelay: '0.4s' }}>
                <Button size="lg" className="btn-liquid-metal text-lg px-12 py-5 text-white font-semibold">
                  Start Exploring
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <Button variant="outline" size="lg" className="btn-chrome-mirror text-lg px-12 py-5 font-semibold">
                  Become a Creator
                </Button>
              </div>

              {/* Enhanced Search Bar */}
              <div className="animate-fade-up max-w-lg mx-auto" style={{ animationDelay: '0.6s' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <Input
                    type="text"
                    placeholder="Search creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="relative pl-6 pr-6 py-8 text-lg glass-morphism text-white placeholder:text-white/60 focus:ring-2 focus:ring-holo-pink/50 border-white/20 focus:border-white/40 rounded-3xl bg-white/5 backdrop-blur-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Creators</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover the most popular creators and join their exclusive communities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCreators.map((creator) => (
                <CreatorCard
                  key={creator.username}
                  {...creator}
                  className="hover:shadow-lg transition-shadow duration-300"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trending Content */}
        <div className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trending Now</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Hot content from across the platform - discover what's capturing everyone's attention
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingContent.map((content) => (
                <MediaTile
                  key={content.id}
                  {...content}
                  size="medium"
                  className="hover:shadow-lg transition-shadow duration-300"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "100K+", label: "Active Creators" },
                { value: "5M+", label: "Premium Subscribers" },
                { value: "50M+", label: "Content Pieces" },
                { value: "$10M+", label: "Creator Earnings" }
              ].map((stat) => (
                <div 
                  key={stat.label}
                  className="bg-card border rounded-lg p-6"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-4 py-20 sm:px-6 lg:px-8 bg-primary">
          <div className="text-center text-primary-foreground max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join the Premium Experience?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Start your journey today and discover exclusive content from the world's most talented creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Sign Up Free
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}