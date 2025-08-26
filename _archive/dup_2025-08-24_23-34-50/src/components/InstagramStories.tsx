import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Plus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface Story {
  id: string;
  creator: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    is_verified: boolean;
  };
  preview_image: string;
  is_viewed: boolean;
  has_new_content: boolean;
  is_live?: boolean;
  is_premium?: boolean;
  story_count: number;
  created_at: string;
}

export default function InstagramStories() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real API call
  useEffect(() => {
    const mockStories: Story[] = [
      {
        id: 'my-story',
        creator: {
          id: user?.id || '0',
          username: user?.user_metadata?.username || 'your_story',
          display_name: 'Your Story',
          avatar_url: user?.user_metadata?.avatar_url || '/placeholder.svg',
          is_verified: false
        },
        preview_image: '',
        is_viewed: false,
        has_new_content: false,
        story_count: 0,
        created_at: new Date().toISOString()
      },
      {
        id: '1',
        creator: {
          id: '1',
          username: 'sophia_luxury',
          display_name: 'Sophia Rose',
          avatar_url: '/lovable-uploads/2db52d3c-95ff-4d97-9f88-8201d599afdf.png',
          is_verified: true
        },
        preview_image: '/lovable-uploads/bc97ee21-392d-4e4d-8117-27a47a8bed40.png',
        is_viewed: false,
        has_new_content: true,
        is_live: true,
        is_premium: true,
        story_count: 3,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        creator: {
          id: '2',
          username: 'alex_fit',
          display_name: 'Alex Fitness',
          avatar_url: '/lovable-uploads/cb53b74b-f714-4e45-a399-b61b2f3de84f.png',
          is_verified: true
        },
        preview_image: '/lovable-uploads/de7e1d60-97a9-4b0d-af11-8f17740ed2ea.png',
        is_viewed: true,
        has_new_content: false,
        story_count: 5,
        created_at: '2024-01-15T08:15:00Z'
      },
      {
        id: '3',
        creator: {
          id: '3',
          username: 'luna_model',
          display_name: 'Luna Belle',
          avatar_url: '/lovable-uploads/bf0fcf1a-8488-4afa-b9ae-463c6a03c31c.png',
          is_verified: true
        },
        preview_image: '/lovable-uploads/fcb70729-3e74-4ee6-8e5a-c5e0811dfbff.png',
        is_viewed: false,
        has_new_content: true,
        is_premium: true,
        story_count: 2,
        created_at: '2024-01-15T12:00:00Z'
      }
    ];

    setTimeout(() => {
      setStories(mockStories);
      setLoading(false);
    }, 500);
  }, [user]);

  const handleStoryClick = (storyId: string) => {
    // Mark story as viewed
    setStories(stories.map(story => 
      story.id === storyId 
        ? { ...story, is_viewed: true, has_new_content: false }
        : story
    ));
  };

  if (loading) {
    return (
      <div className="flex gap-4 p-4 overflow-x-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 min-w-[70px]">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <div className="flex gap-4 p-4 overflow-x-auto">
        {stories.map((story) => {
          const isMyStory = story.id === 'my-story';
          const hasGradient = !story.is_viewed && story.has_new_content;
          
          return (
            <div
              key={story.id}
              className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer"
              onClick={() => handleStoryClick(story.id)}
            >
              <div className="relative">
                {/* Story Ring */}
                <div className={cn(
                  "w-16 h-16 rounded-full p-0.5 transition-all duration-200",
                  hasGradient && "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
                  story.is_viewed && !hasGradient && "bg-gray-300",
                  isMyStory && "bg-gray-300",
                  story.is_premium && !hasGradient && "bg-gradient-to-tr from-purple-500 to-pink-500"
                )}>
                  <div className="w-full h-full bg-white rounded-full p-0.5">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={story.creator.avatar_url} alt={story.creator.display_name} />
                      <AvatarFallback>{story.creator.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Add Story Button */}
                {isMyStory && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Live Badge */}
                {story.is_live && (
                  <Badge className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5">
                    LIVE
                  </Badge>
                )}

                {/* Premium Badge */}
                {story.is_premium && !story.is_live && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-white" />
                  </div>
                )}

                {/* Verified Badge */}
                {story.creator.is_verified && !isMyStory && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Crown className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* Story Label */}
              <span className="text-xs text-gray-700 font-medium text-center leading-tight max-w-[70px] truncate">
                {isMyStory ? 'Your Story' : story.creator.display_name}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}