import React, { useState } from 'react';
import { Search, Heart, MessageCircle, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MobileNavigation } from '@/components/MobileNavigation';
import { useNavigate } from 'react-router-dom';

interface ExplorePost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  isVideo: boolean;
  username: string;
}

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock explore posts data
  const explorePosts: ExplorePost[] = Array.from({ length: 24 }, (_, i) => ({
    id: `explore-${i}`,
    image: `/api/placeholder/300/300?explore${i}`,
    likes: Math.floor(Math.random() * 50000) + 1000,
    comments: Math.floor(Math.random() * 1000) + 50,
    isVideo: i % 5 === 0,
    username: `user_${i + 1}`
  }));

  const filteredPosts = explorePosts.filter(post =>
    post.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border/20 z-40">
        <div className="flex items-center gap-3 p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/feed')}
            className="lg:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators, content..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Explore Grid */}
      <div className="p-1">
        <div className="grid grid-cols-3 gap-1">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className={`relative cursor-pointer group ${
                index % 9 === 0 ? 'col-span-2 row-span-2' : 'aspect-square'
              }`}
              onClick={() => {
                // TODO: Open post modal or navigate to post detail
                console.log('Clicked post:', post.id);
              }}
            >
              <img
                src={post.image}
                alt={`Post by ${post.username}`}
                className="w-full h-full object-cover"
              />
              
              {/* Video indicator */}
              {post.isVideo && (
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5" />
                  </div>
                </div>
              )}

              {/* Hover overlay with stats */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-4 text-white">
                  <div className="flex items-center gap-1">
                    <Heart className="w-5 h-5 fill-white" />
                    <span className="font-semibold">
                      {post.likes > 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span className="font-semibold">
                      {post.comments > 1000 ? `${(post.comments / 1000).toFixed(1)}k` : post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more trigger */}
        {filteredPosts.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
          </div>
        )}

        {filteredPosts.length > 0 && (
          <div className="text-center py-8">
            <Button variant="outline" onClick={() => {
              // TODO: Load more posts
              console.log('Load more posts');
            }}>
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default Explore;