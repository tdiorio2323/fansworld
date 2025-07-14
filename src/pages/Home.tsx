import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { CreatorCard } from "@/components/CreatorCard";
import { MediaTile } from "@/components/MediaTile";
import { Search, ArrowRight, Users, TrendingUp, Star } from "lucide-react";
import { useState } from "react";

// Mock data for featured creators
const featuredCreators = [
  {
    username: "alexandra_grace",
    displayName: "Alexandra Grace",
    bio: "Fashion & Lifestyle Content Creator",
    avatar: "/lovable-uploads/0ff59aeb-791c-4e02-b90b-a73ecbcedf9c.png",
    subscribers: "125K",
    monthlyEarnings: "$8,900",
    isVerified: true
  },
  {
    username: "marcus_creative",
    displayName: "Marcus Thompson",
    bio: "Digital Art & Design Tutorials",
    avatar: "/lovable-uploads/2db52d3c-95ff-4d97-9f88-8201d599afdf.png",
    subscribers: "89K",
    monthlyEarnings: "$6,200",
    isVerified: true
  },
  {
    username: "sofia_wellness",
    displayName: "Sofia Martinez",
    bio: "Wellness & Mindfulness Coach",
    avatar: "/lovable-uploads/cb53b74b-f714-4e45-a399-b61b2f3de84f.png",
    subscribers: "156K",
    monthlyEarnings: "$12,500",
    isVerified: true
  }
];

// Mock data for trending content
const trendingContent = [
  {
    id: "1",
    type: "video" as const,
    src: "/lovable-uploads/bc97ee21-392d-4e4d-8117-27a47a8bed40.png",
    title: "Behind the Scenes: Fashion Week",
    views: 45200,
    likes: 3800
  },
  {
    id: "2",
    type: "image" as const,
    src: "/lovable-uploads/bf0fcf1a-8488-4afa-b9ae-463c6a03c31c.png",
    title: "Digital Art Process",
    views: 28100,
    likes: 2100
  },
  {
    id: "3",
    type: "video" as const,
    src: "/lovable-uploads/de7e1d60-97a9-4b0d-af11-8f17740ed2ea.png",
    title: "Morning Meditation Guide",
    views: 67300,
    likes: 5200
  },
  {
    id: "4",
    type: "image" as const,
    src: "/lovable-uploads/fcb70729-3e74-4ee6-8e5a-c5e0811dfbff.png",
    title: "Lifestyle Photography Tips",
    views: 32400,
    likes: 2700
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - Editorial Style */}
      <section className="section-featured">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Typography */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="caption-small text-muted-foreground">
                    Premium Content Platform
                  </div>
                  <h1 className="headline-xl">
                    Create.
                    <br />
                    Connect.
                    <br />
                    <span className="text-accent">Earn.</span>
                  </h1>
                </div>
                
                <p className="body-lg text-muted-foreground max-w-lg">
                  The exclusive platform for content creators to monetize their work, 
                  build dedicated audiences, and establish lasting creative partnerships.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="btn-editorial h-12 px-8">
                    Start Creating
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="btn-editorial-accent h-12 px-8">
                    Browse Creators
                  </Button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md pt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search creators, content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-2 border-border focus:border-accent"
                  />
                </div>
              </div>

              {/* Right Column - Visual Element */}
              <div className="relative">
                <div className="card-editorial-featured">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="aspect-square bg-muted"></div>
                      <div className="aspect-video bg-accent/10"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="aspect-video bg-accent/20"></div>
                      <div className="aspect-square bg-muted/50"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-accent opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-editorial bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="headline-md text-accent">125K+</div>
              <div className="caption-small text-muted-foreground">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="headline-md text-accent">$2.5M+</div>
              <div className="caption-small text-muted-foreground">Paid to Creators</div>
            </div>
            <div className="text-center">
              <div className="headline-md text-accent">850K+</div>
              <div className="caption-small text-muted-foreground">Monthly Users</div>
            </div>
            <div className="text-center">
              <div className="headline-md text-accent">98%</div>
              <div className="caption-small text-muted-foreground">Creator Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="section-editorial">
        <div className="container mx-auto px-4">
          <div className="content-block-wide">
            <div className="mb-12">
              <h2 className="headline-lg mb-4">Featured Creators</h2>
              <p className="body-md text-muted-foreground">
                Discover top creators building their brands and earning through our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCreators.map((creator, index) => (
                <div key={creator.username} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CreatorCard {...creator} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Content */}
      <section className="section-editorial bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="content-block-wide">
            <div className="mb-12">
              <h2 className="headline-lg mb-4">Trending Content</h2>
              <p className="body-md text-muted-foreground">
                The most engaging content from our creator community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingContent.map((content, index) => (
                <div key={content.id} className="animate-slide-in-left" style={{animationDelay: `${index * 0.1}s`}}>
                  <MediaTile {...content} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="section-editorial">
        <div className="container mx-auto px-4">
          <div className="content-block">
            <h2 className="headline-lg text-center mb-16">Why Choose Our Platform</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent mx-auto flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="headline-md">Higher Earnings</h3>
                <p className="body-md text-muted-foreground">
                  Keep 85% of your revenue with our creator-first commission structure.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="headline-md">Dedicated Audience</h3>
                <p className="body-md text-muted-foreground">
                  Build meaningful connections with fans who value premium content.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent mx-auto flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="headline-md">Premium Tools</h3>
                <p className="body-md text-muted-foreground">
                  Access professional-grade tools for content creation and audience management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-featured bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="content-block text-center">
            <h2 className="headline-lg mb-6 text-background">
              Ready to Start Your Creative Journey?
            </h2>
            <p className="body-lg mb-8 text-background/80 max-w-2xl mx-auto">
              Join thousands of creators who are building sustainable income through 
              premium content creation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-background text-foreground hover:bg-background/90 h-12 px-8">
                Join as Creator
              </Button>
              <Button variant="outline" className="border-background text-background hover:bg-background hover:text-foreground h-12 px-8">
                Browse Content
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}