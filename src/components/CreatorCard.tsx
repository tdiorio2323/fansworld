import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, UserPlus, Crown, Verified } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CreatorCardProps {
  username: string;
  displayName: string;
  bio: string;
  avatar?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  isFollowing?: boolean;
  isSubscribed?: boolean;
  subscriberCount?: number;
  postCount?: number;
  subscriptionPrice?: number;
  className?: string;
}

export function CreatorCard({
  username,
  displayName,
  bio,
  avatar,
  isVerified = false,
  isPremium = false,
  isFollowing = false,
  isSubscribed = false,
  subscriberCount = 0,
  postCount = 0,
  subscriptionPrice = 9.99,
  className = ""
}: CreatorCardProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [subscribed, setSubscribed] = useState(isSubscribed);

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    setFollowing(!following);
  };

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    setSubscribed(!subscribed);
  };

  return (
    <Link to={`/creator/${username}`} className={`block ${className}`}>
      <div className="card-liquid-chrome hover:shadow-neon transition-all duration-300 group">
        {/* Header with Avatar and Badges */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative creator-avatar-chrome">
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatar} alt={displayName} />
              <AvatarFallback className="bg-gradient-cyber-chrome text-white text-lg font-bold">
                {displayName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {isPremium && (
              <div className="absolute -top-1 -right-1 animate-pulse">
                <Crown className="w-5 h-5 text-neon-orange drop-shadow-lg" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg truncate text-holographic">{displayName}</h3>
              {isVerified && (
                <Verified className="w-5 h-5 text-holo-blue flex-shrink-0 drop-shadow-sm" />
              )}
            </div>
            
            <p className="text-muted-foreground text-sm mb-2">@{username}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {isPremium && (
                <Badge variant="outline" className="text-champagne border-holo-gold/40 bg-gradient-champagne/10">
                  Premium
                </Badge>
              )}
              <Badge variant="secondary" className="glass-morphism">
                {subscriberCount.toLocaleString()} fans
              </Badge>
              <Badge variant="secondary" className="glass-morphism">
                {postCount} posts
              </Badge>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {bio}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant={following ? "secondary" : "outline"}
            size="sm"
            onClick={handleFollow}
            className={`flex-1 ${following ? 'btn-chrome-mirror' : 'btn-glass hover:shadow-neon'}`}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {following ? 'Following' : 'Follow'}
          </Button>
          
          {subscribed ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleSubscribe}
              className="flex-1 btn-cyber-chrome"
            >
              <Heart className="w-4 h-4 mr-2 fill-current" />
              Subscribed
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleSubscribe}
              className="flex-1 btn-liquid-metal"
            >
              Subscribe ${subscriptionPrice}/mo
            </Button>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-crystal opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}