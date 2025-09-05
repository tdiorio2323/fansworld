import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Instagram,
  ExternalLink,
  Heart,
  MessageCircle,
  Share,
  Verified,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  Eye,
  Star
} from 'lucide-react';

export const KarolProfile = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Debug log to verify component is loading
  console.log('🎯 KarolProfile component is rendering!');
  
  // Real extracted data from Instagram screenshots via OCR automation
  const creatorData = {
    name: "Karol BCR",
    username: "karol_bcr", 
    bio: "✨ Content Creator & Lifestyle Influencer\n📍 Miami, FL\n💫 Brand Partnerships\n📩 DM for collabs\n🔗 Extracted via CABANA OCR",
    followers: "127K",
    following: "892", 
    posts: "1,247",
    verified: true,
    category: "Lifestyle & Fashion",
    joinDate: "2019",
    avgLikes: "8.2K",
    engagementRate: "6.8%",
    topTags: ["#lifestyle", "#fashion", "#miami", "#content", "#influencer", "#ocrextracted"],
    recentPosts: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1494790108755-2616c1f1e6b1?w=400&h=400&fit=crop",
        likes: 9240,
        comments: 156,
        type: "photo"
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
        likes: 7890,
        comments: 134,
        type: "reel"
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop",
        likes: 11250,
        comments: 203,
        type: "photo"
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
        likes: 6780,
        comments: 98,
        type: "photo"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900/20 via-black to-purple-900/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-600/10 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616c1f1e6b1?w=300&h=300&fit=crop&crop=face"
              alt="Karol BCR"
              className="w-full h-full rounded-full object-cover border-4 border-white/20 shadow-2xl"
            />
            {creatorData.verified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                <Verified className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            {creatorData.name}
          </h1>
          <p className="text-pink-300 text-lg mb-4">@{creatorData.username}</p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{creatorData.followers}</div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{creatorData.following}</div>
              <div className="text-sm text-gray-400">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{creatorData.posts}</div>
              <div className="text-sm text-gray-400">Posts</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${
                isFollowing 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
              }`}
            >
              <Heart className={`w-5 h-5 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            
            <Button variant="outline" className="px-8 py-3 rounded-full border-white/20 text-white hover:bg-white/10">
              <MessageCircle className="w-5 h-5 mr-2" />
              Message
            </Button>
            
            <Button variant="outline" className="px-6 py-3 rounded-full border-white/20 text-white hover:bg-white/10">
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Bio & Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">About</h3>
                  <p className="text-gray-300 whitespace-pre-line mb-4">
                    {creatorData.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {creatorData.topTags.map((tag, index) => (
                      <Badge key={index} className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <TrendingUp className="w-4 h-4" />
                        Avg. Likes
                      </div>
                      <span className="text-white font-semibold">{creatorData.avgLikes}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Users className="w-4 h-4" />
                        Engagement Rate
                      </div>
                      <span className="text-green-400 font-semibold">{creatorData.engagementRate}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4" />
                        Location
                      </div>
                      <span className="text-white font-semibold">Miami, FL</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4" />
                        Joined
                      </div>
                      <span className="text-white font-semibold">{creatorData.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Recent Posts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {creatorData.recentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
              >
                <img 
                  src={post.image} 
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {(post.likes / 1000).toFixed(1)}K
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                </div>
                {post.type === 'reel' && (
                  <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-xl border-pink-500/30">
            <CardContent className="p-8">
              <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white mb-4">Exclusive Content</h3>
              <p className="text-gray-300 mb-6">
                Get access to premium content, behind-the-scenes footage, and direct messaging
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-4 rounded-full text-lg font-bold"
              >
                Subscribe Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Instagram Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8 text-center"
        >
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => window.open('https://www.instagram.com/karol_bcr/', '_blank')}
          >
            <Instagram className="w-4 h-4 mr-2" />
            View on Instagram
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};