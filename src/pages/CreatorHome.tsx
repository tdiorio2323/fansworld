import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { 
  Heart, MessageCircle, Share, Bookmark, MoreVertical, 
  Crown, Star, Users, TrendingUp, Gift, Zap, Diamond,
  Sparkles, Eye, DollarSign, Award, Flame
} from 'lucide-react'

const CreatorHome = () => {
  const { user } = useAuth()
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set())

  const stories = [
    { id: 1, username: 'You', avatar: user?.avatar || '', isOwn: true, isLive: false },
    { id: 2, username: 'sophia_lux', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia&backgroundColor=9333ea', isVip: true, isLive: true },
    { id: 3, username: 'alex_creator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=7c3aed', isVip: false, isLive: false },
    { id: 4, username: 'luxury_life', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luxury&backgroundColor=8b5cf6', isVip: true, isLive: false },
    { id: 5, username: 'creative_mind', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creative&backgroundColor=6d28d9', isVip: false, isLive: false },
  ]

  const posts = [
    {
      id: 1,
      username: 'sophia_lux',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia&backgroundColor=9333ea',
      isVip: true,
      tier: 'Diamond',
      timeAgo: '2h',
      content: 'Just dropped my exclusive VIP masterclass on premium content creation! 💎✨ The response has been incredible - thank you to all my Diamond tier supporters!',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=600&fit=crop',
      likes: 1247,
      comments: 89,
      isVipContent: true,
      earnings: 2850,
      engagement: 94.2
    },
    {
      id: 2,
      username: 'alex_creator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=7c3aed',
      isVip: false,
      tier: 'Creator',
      timeAgo: '4h',
      content: 'Behind the scenes of today\'s photoshoot! The lighting was absolutely perfect. What do you think of this concept? 📸',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&h=600&fit=crop',
      likes: 892,
      comments: 54,
      isVipContent: false,
      earnings: 320,
      engagement: 78.5
    },
    {
      id: 3,
      username: 'luxury_life',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luxury&backgroundColor=8b5cf6',
      isVip: true,
      tier: 'Platinum',
      timeAgo: '6h',
      content: 'Exclusive: My morning routine that changed everything 🌅 This VIP-only content includes my personal productivity secrets and wellness tips!',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop',
      likes: 2156,
      comments: 178,
      isVipContent: true,
      earnings: 4200,
      engagement: 96.8
    }
  ]

  const suggestedCreators = [
    { 
      username: 'elena_premium', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena&backgroundColor=9333ea', 
      followers: '127K', 
      isVip: true,
      tier: 'Diamond',
      specialty: 'Luxury Lifestyle'
    },
    { 
      username: 'marcus_elite', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus&backgroundColor=7c3aed', 
      followers: '89K', 
      isVip: true,
      tier: 'Platinum',
      specialty: 'Business & Finance'
    },
    { 
      username: 'aria_artistic', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aria&backgroundColor=8b5cf6', 
      followers: '245K', 
      isVip: true,
      tier: 'Diamond',
      specialty: 'Digital Art'
    }
  ]

  const handleLike = (postId: number) => {
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  const handleSave = (postId: number) => {
    const newSaved = new Set(savedPosts)
    if (newSaved.has(postId)) {
      newSaved.delete(postId)
    } else {
      newSaved.add(postId)
    }
    setSavedPosts(newSaved)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamond': return 'from-cyan-400 to-blue-500'
      case 'Platinum': return 'from-gray-300 to-gray-500'
      case 'Gold': return 'from-yellow-400 to-orange-500'
      default: return 'from-purple-400 to-pink-500'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Diamond': return <Diamond className="w-3 h-3" />
      case 'Platinum': return <Award className="w-3 h-3" />
      case 'Gold': return <Crown className="w-3 h-3" />
      default: return <Star className="w-3 h-3" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Creator Feed</h1>
            <p className="text-gray-300 text-luxury">Discover premium content from elite creators</p>
          </div>
          <div className="glass-card-premium p-4 rounded-2xl pulse-glow">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={user?.avatar} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full border-2 border-purple-500 shimmer"
                />
                {user?.isVip && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 status-vip rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-gray-900" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-luxury">{user?.username}</div>
                <div className="text-xs vip-text">{user?.tier?.toUpperCase()} TIER</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stories */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 text-luxury">Stories</h3>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {stories.map((story) => (
                  <div key={story.id} className="flex-shrink-0 text-center interactive-scale">
                    <div className="relative mb-2">
                      <div className={`w-16 h-16 rounded-full p-1 ${
                        story.isLive ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                        story.isVip ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        'bg-gradient-to-r from-gray-500 to-gray-600'
                      } shimmer`}>
                        <img 
                          src={story.avatar} 
                          alt={story.username}
                          className="w-full h-full rounded-full border-2 border-gray-900"
                        />
                      </div>
                      {story.isLive && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold pulse-glow">
                          LIVE
                        </div>
                      )}
                      {story.isVip && !story.isLive && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 status-vip rounded-full flex items-center justify-center">
                          <Crown className="w-2.5 h-2.5 text-gray-900" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-300 font-medium">{story.username}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="content-card rounded-2xl overflow-hidden fade-in">
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img 
                            src={post.avatar} 
                            alt={post.username}
                            className="w-12 h-12 rounded-full border-2 border-purple-500 shimmer"
                          />
                          {post.isVip && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 status-vip rounded-full flex items-center justify-center">
                              <Crown className="w-3 h-3 text-gray-900" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-luxury">{post.username}</span>
                            {post.isVip && (
                              <div className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getTierColor(post.tier)} text-white flex items-center gap-1`}>
                                {getTierIcon(post.tier)}
                                {post.tier}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{post.timeAgo}</div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-full transition-colors interactive-scale">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-6 pb-4">
                    <p className="text-gray-200 leading-relaxed text-luxury">{post.content}</p>
                    {post.isVipContent && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <div className="vip-glow px-3 py-1 rounded-full text-xs font-semibold vip-text flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          VIP EXCLUSIVE
                        </div>
                        <div className="flex items-center gap-1 text-green-400">
                          <DollarSign className="w-3 h-3" />
                          <span className="text-xs font-semibold">${post.earnings}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Image */}
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt="Post content"
                      className="w-full h-96 object-cover"
                    />
                    {post.isVipContent && (
                      <div className="absolute top-4 right-4 vip-glow px-3 py-2 rounded-full backdrop-blur-sm">
                        <Crown className="w-5 h-5 vip-text" />
                      </div>
                    )}
                  </div>

                  {/* Post Stats & Actions */}
                  <div className="p-6">
                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{(post.likes * 2.3).toFixed(0)}K views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span>{post.engagement}% engagement</span>
                        </div>
                      </div>
                      {post.isVipContent && (
                        <div className="flex items-center gap-1 text-green-400 font-semibold">
                          <Zap className="w-4 h-4" />
                          <span>${post.earnings} earned</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-2 hover:text-red-400 transition-colors interactive-scale"
                        >
                          <Heart className={`w-6 h-6 ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="font-semibold">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors interactive-scale">
                          <MessageCircle className="w-6 h-6" />
                          <span className="font-semibold">{post.comments}</span>
                        </button>
                        <button className="hover:text-green-400 transition-colors interactive-scale">
                          <Share className="w-6 h-6" />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleSave(post.id)}
                        className="hover:text-yellow-400 transition-colors interactive-scale"
                      >
                        <Bookmark className={`w-6 h-6 ${savedPosts.has(post.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="glass-card-premium p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 text-luxury gradient-text">Your Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-300">Streak</span>
                  </div>
                  <span className="font-bold text-orange-400">12 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Growth</span>
                  </div>
                  <span className="font-bold text-green-400">+23.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Earnings</span>
                  </div>
                  <span className="font-bold text-yellow-400">$2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 vip-text" />
                    <span className="text-gray-300">VIP Members</span>
                  </div>
                  <span className="font-bold vip-text">147</span>
                </div>
              </div>
            </div>

            {/* Suggested Creators */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 text-luxury">Elite Creators</h3>
              <div className="space-y-4">
                {suggestedCreators.map((creator, index) => (
                  <div key={index} className="flex items-center justify-between interactive-scale">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img 
                          src={creator.avatar} 
                          alt={creator.username}
                          className="w-12 h-12 rounded-full shimmer"
                        />
                        {creator.isVip && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 status-vip rounded-full flex items-center justify-center">
                            <Crown className="w-2.5 h-2.5 text-gray-900" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-sm text-luxury">{creator.username}</div>
                          <div className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getTierColor(creator.tier)} text-white flex items-center gap-1`}>
                            {getTierIcon(creator.tier)}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">{creator.specialty}</div>
                        <div className="text-xs text-gray-500">{creator.followers} followers</div>
                      </div>
                    </div>
                    <button className="luxury-button px-4 py-2 rounded-full text-sm font-semibold interactive-scale">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* VIP Upgrade Prompt */}
            {!user?.isVip && (
              <div className="glass-card-premium p-6 rounded-2xl vip-glow pulse-glow">
                <div className="text-center">
                  <div className="w-16 h-16 vip-glow rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 vip-text" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 gradient-text">Upgrade to VIP</h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Unlock exclusive content, premium features, and priority access to elite creators.
                  </p>
                  <button className="luxury-button w-full py-3 rounded-full font-semibold interactive-scale shimmer">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Upgrade Now
                    </div>
                  </button>
                  <div className="mt-3 text-xs text-gray-400">
                    Starting at $29/month
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatorHome 