import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/supabase';
import { Heart, MessageCircle, Share, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ReelContent {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  creator_id: string;
  is_premium: boolean;
  price: number | null;
  created_at: string;
  creator: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export default function Reels() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reels, setReels] = useState<ReelContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    try {
      // In a real app, this would fetch video content with moderation filtering:
      // const { data, error } = await supabase
      //   .from('creator_content')
      //   .select(`
      //     *,
      //     profiles!creator_content_creator_id_fkey(username, display_name, avatar_url)
      //   `)
      //   .eq('content_type', 'video')
      //   .eq('moderation_status', 'approved') // Only approved content
      //   .order('created_at', { ascending: false });

      // For now, using mock data
      const mockReels: ReelContent[] = [
        {
          id: '1',
          title: 'Amazing Dance Moves',
          description: 'Check out this incredible routine! 💃',
          file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          creator_id: 'creator1',
          is_premium: false,
          price: null,
          created_at: new Date().toISOString(),
          creator: {
            username: 'dancequeenb',
            display_name: 'Bella Dance',
            avatar_url: null
          },
          engagement: {
            likes: 1249,
            comments: 87,
            shares: 23
          }
        },
        {
          id: '2',
          title: 'Behind the Scenes',
          description: 'Exclusive content from my latest photoshoot ✨',
          file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          creator_id: 'creator2',
          is_premium: true,
          price: 999, // $9.99
          created_at: new Date().toISOString(),
          creator: {
            username: 'modelm',
            display_name: 'Maya Model',
            avatar_url: null
          },
          engagement: {
            likes: 892,
            comments: 45,
            shares: 12
          }
        }
      ];

      setReels(mockReels);
    } catch (error) {
      console.error('Error loading reels:', error);
      toast({
        title: "Error",
        description: "Failed to load reels. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (reelId: string) => {
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });

    toast({
      title: likedReels.has(reelId) ? "Unliked!" : "Liked!",
      description: likedReels.has(reelId) ? "Removed from liked reels" : "Added to liked reels",
    });
  };

  const handleComment = (reelId: string) => {
    toast({
      title: "Comments",
      description: "Comment feature coming soon! 💬",
    });
  };

  const handleShare = (reelId: string) => {
    toast({
      title: "Shared!",
      description: "Reel shared successfully! 🎉",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentReel = reels[currentIndex];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/home')}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-white font-semibold text-lg">Reels</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
        >
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Reels Container */}
      <div className="relative h-screen">
        {currentReel && (
          <motion.div
            key={currentReel.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0"
          >
            {/* Video Background */}
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              {currentReel.is_premium ? (
                // Premium Content Overlay
                <div className="text-center text-white p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                  <p className="text-gray-300 mb-4">Unlock this exclusive reel</p>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                    Subscribe for ${((currentReel.price || 0) / 100).toFixed(2)}
                  </Button>
                </div>
              ) : (
                // Free Video Placeholder
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                    <div className="text-4xl">🎥</div>
                  </div>
                  <p className="text-gray-300">Video Player Placeholder</p>
                  <p className="text-sm text-gray-500 mt-2">
                    In production, this would be a video player
                  </p>
                </div>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-20 flex flex-col gap-6">
              {/* Creator Avatar */}
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-white">
                  <AvatarImage src={currentReel.creator.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white">
                    {currentReel.creator.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="text-white text-xs font-bold">+</div>
                </div>
              </div>

              {/* Like Button */}
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(currentReel.id)}
                  className={`p-3 rounded-full ${
                    likedReels.has(currentReel.id) 
                      ? 'text-red-500 bg-white/20' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Heart 
                    className={`w-7 h-7 ${likedReels.has(currentReel.id) ? 'fill-current' : ''}`} 
                  />
                </Button>
                <span className="text-white text-sm font-medium mt-1">
                  {currentReel.engagement.likes + (likedReels.has(currentReel.id) ? 1 : 0)}
                </span>
              </div>

              {/* Comment Button */}
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleComment(currentReel.id)}
                  className="text-white hover:bg-white/20 p-3 rounded-full"
                >
                  <MessageCircle className="w-7 h-7" />
                </Button>
                <span className="text-white text-sm font-medium mt-1">
                  {currentReel.engagement.comments}
                </span>
              </div>

              {/* Share Button */}
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(currentReel.id)}
                  className="text-white hover:bg-white/20 p-3 rounded-full"
                >
                  <Share className="w-7 h-7" />
                </Button>
                <span className="text-white text-sm font-medium mt-1">
                  {currentReel.engagement.shares}
                </span>
              </div>
            </div>

            {/* Bottom Content Info */}
            <div className="absolute bottom-4 left-4 right-20 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentReel.creator.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white text-sm">
                    {currentReel.creator.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold">{currentReel.creator.username}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent border-white text-white hover:bg-white hover:text-black"
                >
                  Follow
                </Button>
              </div>
              <h3 className="font-semibold text-lg mb-1">{currentReel.title}</h3>
              {currentReel.description && (
                <p className="text-gray-300 text-sm">{currentReel.description}</p>
              )}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              {reels.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Swipe Navigation (for mobile) */}
      <div className="absolute inset-0 z-40">
        <div 
          className="h-1/2 w-full"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        />
        <div 
          className="h-1/2 w-full"
          onClick={() => setCurrentIndex(Math.min(reels.length - 1, currentIndex + 1))}
        />
      </div>
    </div>
  );
}