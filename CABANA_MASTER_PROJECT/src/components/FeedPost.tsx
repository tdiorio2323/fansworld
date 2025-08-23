import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FeedPostProps {
  id: string;
  username: string;
  avatar: string;
  timeAgo: string;
  content?: string;
  images?: string[];
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export const FeedPost: React.FC<FeedPostProps> = ({
  id,
  username,
  avatar,
  timeAgo,
  content,
  images = [],
  likes,
  comments,
  isLiked = false,
  isSaved = false,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <Card className="border-0 border-b border-border/20 rounded-none bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{username}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div className="relative aspect-square bg-black">
          <img
            src={images[currentImageIndex]}
            alt={`Post by ${username}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1}/{images.length}
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={handleLike}
            >
              <Heart 
                className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} 
              />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={handleSave}
          >
            <Bookmark 
              className={`w-6 h-6 ${saved ? 'fill-foreground' : ''}`} 
            />
          </Button>
        </div>

        {/* Likes */}
        <div className="text-sm font-semibold">
          {likes.toLocaleString()} likes
        </div>

        {/* Content */}
        {content && (
          <div className="text-sm">
            <span className="font-semibold">{username}</span>{' '}
            <span>{content}</span>
          </div>
        )}

        {/* Comments */}
        {comments > 0 && (
          <div className="text-sm text-muted-foreground">
            View all {comments} comments
          </div>
        )}

        {/* Add comment */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/20">
          <Avatar className="w-6 h-6">
            <AvatarImage src="/api/placeholder/32/32" alt="You" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground border-none outline-none"
          />
        </div>
      </div>
    </Card>
  );
};