import { useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreatorCard } from "@/components/CreatorCard";
import { MediaTile } from "@/components/MediaTile";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  "All", "Fitness", "Fashion", "Lifestyle", "Gaming", "Music", "Art", "Photography"
];

const mockCreators = [
  {
    username: "sophiarose",
    displayName: "Sophia Rose",
    bio: "Fashion enthusiast sharing style tips and exclusive looks",
    avatar: "/lovable-uploads/0ff59aeb-791c-4e02-b90b-a73ecbcedf9c.png",
    isVerified: true,
    subscriberCount: 125000,
    category: "Fashion"
  },
  {
    username: "alexfitness",
    displayName: "Alex Martinez",
    bio: "Fitness coach helping you achieve your best self",
    avatar: "/lovable-uploads/2db52d3c-95ff-4d97-9f88-8201d599afdf.png",
    isVerified: true,
    subscriberCount: 89000,
    category: "Fitness"
  },
  {
    username: "luna_art",
    displayName: "Luna Chen",
    bio: "Digital artist creating stunning visual experiences",
    avatar: "/lovable-uploads/bf0fcf1a-8488-4afa-b9ae-463c6a03c31c.png",
    isVerified: true,
    subscriberCount: 156000,
    category: "Art"
  },
  {
    username: "musicmaven",
    displayName: "Riley Thompson",
    bio: "Musician sharing behind-the-scenes content and exclusive tracks",
    avatar: "/lovable-uploads/de7e1d60-97a9-4b0d-af11-8f17740ed2ea.png",
    isVerified: true,
    subscriberCount: 203000,
    category: "Music"
  }
];

const mockContent = [
  {
    id: "1",
    type: "image" as const,
    src: "/lovable-uploads/fcb70729-3e74-4ee6-8e5a-c5e0811dfbff.png",
    thumbnail: "/lovable-uploads/fcb70729-3e74-4ee6-8e5a-c5e0811dfbff.png",
    title: "Behind the Scenes",
    isLocked: true,
    price: 15.99,
    likes: 2847
  },
  {
    id: "2", 
    type: "video" as const,
    src: "/lovable-uploads/bc97ee21-392d-4e4d-8117-27a47a8bed40.png",
    thumbnail: "/lovable-uploads/bc97ee21-392d-4e4d-8117-27a47a8bed40.png",
    title: "Morning Routine",
    isLocked: false,
    likes: 1923,
    duration: "3:42"
  }
];

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCreators = mockCreators.filter(creator => {
    const matchesSearch = creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || creator.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search creators and content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Filter className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                className="h-12 w-12"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                className="h-12 w-12"
                onClick={() => setViewMode("list")}
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="creators" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="creators">
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator.username} {...creator} />
              ))}
            </div>
            
            {filteredCreators.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No creators found matching your search criteria
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockContent.map((content) => (
                <MediaTile key={content.id} {...content} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}