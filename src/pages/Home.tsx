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
                  <span className="block text-chrome mt-2 animate-pulse">Champagne Room</span>
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
        <div className="px-4 py-24 sm:px-6 lg:px-8 relative">
          {/* Decorative Accent Images */}
          <div className="absolute top-10 right-20 w-40 h-40 opacity-10 rotate-12 animate-float">
            <img 
              src="/lovable-uploads/bf0fcf1a-8488-4afa-b9ae-463c6a03c31c.png" 
              alt="" 
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
          <div className="absolute bottom-20 left-10 w-32 h-32 opacity-8 -rotate-6 float-animation" style={{ animationDelay: '2s' }}>
            <img 
              src="/lovable-uploads/fcb70729-3e74-4ee6-8e5a-c5e0811dfbff.png" 
              alt="" 
              className="w-full h-full object-cover rounded-2xl blur-sm"
            />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Crown className="w-8 h-8 text-holo-gold drop-shadow-lg float-animation" />
                <h2 className="text-4xl md:text-6xl font-luxury font-bold text-champagne">Featured Creators</h2>
              </div>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
                Discover the most popular creators on Champagne Room and join their exclusive communities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCreators.map((creator, index) => (
                <div 
                  key={creator.username}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CreatorCard
                    {...creator}
                    className="card-luxury hover:scale-[1.02] transition-all duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Content */}
        <div className="px-4 py-24 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-transparent to-accent/5"></div>
          
          {/* Crystal Accent Images */}
          <div className="absolute top-20 left-10 w-36 h-36 opacity-12 rotate-45 animate-float">
            <img 
              src="/lovable-uploads/bc97ee21-392d-4e4d-8117-27a47a8bed40.png" 
              alt="" 
              className="w-full h-full object-cover rounded-3xl blur-sm"
            />
          </div>
          <div className="absolute bottom-10 right-20 w-28 h-28 opacity-15 -rotate-12 float-animation" style={{ animationDelay: '1.5s' }}>
            <img 
              src="/lovable-uploads/0ff59aeb-791c-4e02-b90b-a73ecbcedf9c.png" 
              alt="" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          
          <div className="relative max-w-7xl mx-auto z-10">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-4 mb-6">
                <TrendingUp className="w-8 h-8 text-holo-pink float-animation" style={{ animationDelay: '1s' }} />
                <h2 className="text-4xl md:text-6xl font-luxury font-bold text-holographic">Trending Now</h2>
              </div>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
                Hot content from across the platform - discover what's capturing everyone's attention
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingContent.map((content, index) => (
                <div 
                  key={content.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MediaTile
                    {...content}
                    size="medium"
                    className="media-tile hover:scale-[1.05] transition-all duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 py-24 sm:px-6 lg:px-8 relative">
          {/* Floating Crystal Elements */}
          <div className="absolute top-0 left-1/4 w-20 h-20 opacity-20 rotate-12 animate-float">
            <img 
              src="/lovable-uploads/2db52d3c-95ff-4d97-9f88-8201d599afdf.png" 
              alt="" 
              className="w-full h-full object-cover rounded-xl blur-sm"
            />
          </div>
          <div className="absolute bottom-0 right-1/3 w-24 h-24 opacity-25 -rotate-6 float-animation" style={{ animationDelay: '2s' }}>
            <img 
              src="/lovable-uploads/de7e1d60-97a9-4b0d-af11-8f17740ed2ea.png" 
              alt="" 
              className="w-full h-full object-cover rounded-xl blur-sm"
            />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "100K+", label: "Active Creators", gradient: "text-holographic" },
                { value: "5M+", label: "Premium Subscribers", gradient: "text-champagne" },
                { value: "50M+", label: "Content Pieces", gradient: "text-aurora" },
                { value: "$10M+", label: "Creator Earnings", gradient: "text-luxury" }
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className="card-crystal p-8 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`text-4xl md:text-5xl font-luxury font-bold mb-4 ${stat.gradient}`}>
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-lg font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-4 py-32 sm:px-6 lg:px-8 bg-gradient-champagne relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-crystal opacity-20" />
          
          {/* Premium Accent Images */}
          <div className="absolute top-10 left-10 w-48 h-48 opacity-15 rotate-12 animate-float">
            <img 
              src="/lovable-uploads/bf0fcf1a-8488-4afa-b9ae-463c6a03c31c.png" 
              alt="" 
              className="w-full h-full object-cover rounded-3xl blur-sm"
            />
          </div>
          <div className="absolute bottom-20 right-10 w-40 h-40 opacity-20 -rotate-6 float-animation" style={{ animationDelay: '1s' }}>
            <img 
              src="/lovable-uploads/fcb70729-3e74-4ee6-8e5a-c5e0811dfbff.png" 
              alt="" 
              className="w-full h-full object-cover rounded-3xl blur-sm"
            />
          </div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 opacity-10 rotate-45 float-animation" style={{ animationDelay: '2s' }}>
            <img 
              src="/lovable-uploads/bc97ee21-392d-4e4d-8117-27a47a8bed40.png" 
              alt="" 
              className="w-full h-full object-cover rounded-2xl blur-sm"
            />
          </div>
          
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-holo-pink/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-holo-blue/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="text-center text-white relative z-10 max-w-5xl mx-auto">
            <Sparkles className="w-20 h-20 mx-auto mb-8 text-holo-gold drop-shadow-lg float-animation" />
            <h2 className="text-5xl md:text-7xl font-luxury font-bold mb-8 text-holographic leading-tight">
              Ready to Join the Premium Experience?
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90 leading-relaxed font-light">
              Start your journey today and discover exclusive content from the world's most talented creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="btn-cyber-chrome text-lg px-12 py-6 font-semibold">
                Sign Up Free
              </Button>
              <Button variant="outline" size="lg" className="btn-chrome-mirror text-lg px-12 py-6 font-semibold">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}