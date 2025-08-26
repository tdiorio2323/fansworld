import { useState } from "react";
import { Play, Lock, Heart, MessageCircle, Share, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaTileProps {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  isLocked?: boolean;
  price?: number;
  title?: string;
  description?: string;
  likes?: number;
  comments?: number;
  views?: number;
  duration?: string; // For videos, e.g., "2:34"
  isLiked?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

export function MediaTile({
  id,
  type,
  src,
  thumbnail,
  isLocked = false,
  price = 0,
  title,
  description,
  likes = 0,
  comments = 0,
  views = 0,
  duration,
  isLiked = false,
  size = 'medium',
  className = "",
  onClick
}: MediaTileProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Share functionality
  };

  const sizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-[4/5]',
    large: 'aspect-[3/4]'
  };

  const displaySrc = thumbnail || src;

  return (
    <div
      className={cn("media-tile group", sizeClasses[size], className)}
      onClick={onClick}
    >
      {/* Media Content */}
      <div className="relative w-full h-full">
        <img
          src={displaySrc}
          alt={title || 'Media content'}
          className="w-full h-full object-cover"
        />
        
        {/* Video Play Button */}
        {type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
          </div>
        )}

        {/* Video Duration */}
        {type === 'video' && duration && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-medium">
            {duration}
          </div>
        )}

        {/* Lock Overlay for Paid Content */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
            <div className="bg-white/20 backdrop-blur-xl rounded-full p-4 mb-3">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="text-white text-center">
              <p className="font-bold text-lg">${price}</p>
              <p className="text-sm opacity-90">Unlock to view</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        {title && (
          <h4 className="font-semibold text-sm mb-1 line-clamp-1">{title}</h4>
        )}
        
        {description && size !== 'small' && (
          <p className="text-xs opacity-90 mb-2 line-clamp-2">{description}</p>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views.toLocaleString()}</span>
            </div>
            
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 transition-colors",
                liked ? "text-red-400" : "text-white"
              )}
            >
              <Heart className={cn("w-3 h-3", liked && "fill-current")} />
              <span>{likeCount.toLocaleString()}</span>
            </button>
            
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{comments.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Premium Badge */}
      {price > 0 && !isLocked && (
        <div className="absolute top-3 left-3 bg-gradient-primary px-2 py-1 rounded-full text-xs font-medium text-white">
          Premium
        </div>
      )}
    </div>
  );
}