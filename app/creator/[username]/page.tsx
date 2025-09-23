'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Crown, 
  Star, 
  Gift, 
  Lock, 
  Play,
  Image as ImageIcon,
  Users,
  Calendar,
  DollarSign,
  Zap,
  Bell,
  BellOff,
  MoreHorizontal,
  Video,
  Camera,
  Send
} from 'lucide-react'

import { EnhancedGlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/enhanced-glass-card'
import { FrostedButton } from '@/components/ui/frosted-button'
import { HolographicLogo } from '@/components/ui/holographic-logo'

interface CreatorData {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  coverImageUrl?: string
  bio: string
  location?: string
  isVerified: boolean
  isOnline: boolean
  lastSeen?: string
  stats: {
    posts: number
    subscribers: number
    likes: number
    mediaCount: number
  }
  subscription: {
    price: number
    currency: string
    discount?: {
      percentage: number
      expiresAt: string
    }
  }
  socialLinks?: {
    twitter?: string
    instagram?: string
    tiktok?: string
  }
}

interface ContentItem {
  id: string
  type: 'image' | 'video' | 'live'
  previewUrl: string
  isLocked: boolean
  likes: number
  comments: number
  price: number
  duration?: string
  createdAt: string
  title?: string
  description?: string
}

export default function CreatorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  
  const [creator, setCreator] = useState<CreatorData | null>(null)
  const [content, setContent] = useState<ContentItem[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCreator: CreatorData = {
      id: '1',
      username: username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      coverImageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
      bio: 'Creating exclusive premium content just for you ✨ Join my VIP world for the ultimate luxury experience.',
      location: 'Los Angeles, CA',
      isVerified: true,
      isOnline: Math.random() > 0.5,
      stats: {
        posts: Math.floor(Math.random() * 500) + 100,
        subscribers: Math.floor(Math.random() * 50000) + 10000,
        likes: Math.floor(Math.random() * 100000) + 50000,
        mediaCount: Math.floor(Math.random() * 1000) + 200
      },
      subscription: {
        price: Math.floor(Math.random() * 3000) + 999, // in cents
        currency: 'USD',
        discount: Math.random() > 0.7 ? {
          percentage: 20,
          expiresAt: '2024-12-31'
        } : undefined
      },
      socialLinks: {
        instagram: `@${username}`,
        twitter: `@${username}`
      }
    }

    const mockContent: ContentItem[] = Array.from({ length: 12 }, (_, i) => ({
      id: `content-${i}`,
      type: ['image', 'video'][Math.floor(Math.random() * 2)] as 'image' | 'video',
      previewUrl: `https://picsum.photos/400/400?random=${i}`,
      isLocked: Math.random() > 0.6,
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      price: Math.random() > 0.7 ? Math.floor(Math.random() * 2000) + 500 : 0,
      duration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      title: `Exclusive Content ${i + 1}`,
      description: 'Premium content for VIP subscribers only'
    }))

    setCreator(mockCreator)
    setContent(mockContent)
    setLoading(false)
  }, [username])

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
  }

  const handleMessage = () => {
    router.push(`/messages/${creator?.username}`)
  }

  const handleTip = () => {
    // Open tip modal
    console.log('Open tip modal')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center">
        <EnhancedGlassCard variant="premium" className="p-8 text-center">
          <h1 className="text-2xl font-bebas text-white mb-4">Creator Not Found</h1>
          <p className="text-white/70">The creator you're looking for doesn't exist or has been removed.</p>
        </EnhancedGlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
      {/* Ultra-Luxury Navigation */}
      <nav className="relative z-50 p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <HolographicLogo size="sm" animated={true} showText={true} variant="default" />
          <div className="flex items-center gap-4">
            <FrostedButton variant="ghost" size="sm" onClick={() => router.push('/explore')}>
              Explore
            </FrostedButton>
            <FrostedButton variant="ghost" size="sm" onClick={() => router.push('/messages')}>
              Messages
            </FrostedButton>
            <FrostedButton variant="holographic" size="sm" onClick={() => router.push('/profile')}>
              Profile
            </FrostedButton>
          </div>
        </div>
      </nav>

      {/* Cover Image Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-cyan-600/30" />
        {creator.coverImageUrl && (
          <motion.img
            src={creator.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Profile Actions */}
        <div className="absolute top-6 right-6 flex gap-3">
          <FrostedButton variant="ghost" size="sm">
            <Share2 size={16} />
          </FrostedButton>
          <FrostedButton variant="ghost" size="sm">
            <MoreHorizontal size={16} />
          </FrostedButton>
        </div>
      </div>

      <div className="relative -mt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Creator Profile Card */}
          <EnhancedGlassCard 
            variant="premium" 
            size="lg" 
            animation="float" 
            shimmer={true}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <motion.div 
                  className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={creator.avatarUrl} 
                    alt={creator.displayName}
                    className="w-full h-full object-cover"
                  />
                  {creator.isOnline && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-400 rounded-full border-3 border-white shadow-lg" />
                  )}
                </motion.div>
              </div>

              {/* Creator Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="font-bebas text-3xl font-bold text-white">
                        {creator.displayName}
                      </h1>
                      {creator.isVerified && (
                        <Crown className="w-6 h-6 text-amber-400" />
                      )}
                      {creator.isOnline && (
                        <span className="px-2 py-1 bg-emerald-400/20 border border-emerald-400/30 rounded-lg text-emerald-300 text-xs font-medium">
                          ONLINE
                        </span>
                      )}
                    </div>
                    <div className="text-white/70 mb-1">@{creator.username}</div>
                    {creator.location && (
                      <div className="text-white/50 text-sm mb-3">{creator.location}</div>
                    )}
                    <p className="text-white/80 leading-relaxed max-w-2xl">{creator.bio}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                  {[
                    { label: 'Posts', value: creator.stats.posts },
                    { label: 'Fans', value: creator.stats.subscribers },
                    { label: 'Likes', value: creator.stats.likes },
                    { label: 'Media', value: creator.stats.mediaCount }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {formatCount(stat.value)}
                      </div>
                      <div className="text-white/60 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {!isSubscribed ? (
                    <FrostedButton
                      variant="holographic"
                      size="lg"
                      glow="rainbow"
                      className="flex-1 min-w-[200px] font-bold"
                      onClick={handleSubscribe}
                    >
                      <Star size={18} />
                      Subscribe
                      <span className="ml-2 font-bold">
                        {creator.subscription.discount 
                          ? formatPrice(creator.subscription.price * (1 - creator.subscription.discount.percentage / 100))
                          : formatPrice(creator.subscription.price)
                        }
                      </span>
                    </FrostedButton>
                  ) : (
                    <FrostedButton
                      variant="neon"
                      size="lg"
                      className="flex-1 min-w-[200px] font-bold"
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      <Heart size={18} className={isFollowing ? 'fill-current' : ''} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </FrostedButton>
                  )}
                  
                  <FrostedButton variant="luxury" size="lg" onClick={handleMessage}>
                    <MessageCircle size={18} />
                    Message
                  </FrostedButton>
                  
                  <FrostedButton variant="premium" size="lg" onClick={handleTip}>
                    <Gift size={18} />
                    Tip
                  </FrostedButton>
                  
                  <FrostedButton variant="ghost" size="lg">
                    <Video size={18} />
                    Live
                  </FrostedButton>
                </div>
              </div>
            </div>
          </EnhancedGlassCard>

          {/* Content Tabs */}
          <EnhancedGlassCard variant="diamond" size="default" className="mb-6">
            <div className="flex overflow-x-auto">
              {[
                { id: 'posts', label: 'Posts', icon: <ImageIcon size={16} /> },
                { id: 'videos', label: 'Videos', icon: <Video size={16} /> },
                { id: 'live', label: 'Live', icon: <Zap size={16} /> },
                { id: 'about', label: 'About', icon: <Users size={16} /> }
              ].map((tab) => (
                <FrostedButton
                  key={tab.id}
                  variant={activeTab === tab.id ? 'holographic' : 'ghost'}
                  size="lg"
                  className="flex-1 whitespace-nowrap"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </FrostedButton>
              ))}
            </div>
          </EnhancedGlassCard>

          {/* Content Grid */}
          {activeTab === 'posts' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {content.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EnhancedGlassCard 
                    variant="frosted" 
                    size="sm" 
                    animation="float"
                    className="aspect-square cursor-pointer group overflow-hidden"
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={item.previewUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Content type indicator */}
                      {item.type === 'video' && item.duration && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                          {item.duration}
                        </div>
                      )}
                      
                      {/* Lock overlay */}
                      {item.isLocked && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Lock size={24} className="mx-auto mb-2" />
                            <div className="text-sm font-medium">
                              {item.price > 0 ? formatPrice(item.price) : 'Subscribe'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Engagement stats */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <div className="flex justify-between text-white text-sm">
                          <div className="flex items-center gap-1">
                            <Heart size={14} />
                            {formatCount(item.likes)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={14} />
                            {formatCount(item.comments)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </EnhancedGlassCard>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <EnhancedGlassCard variant="luxury" size="lg">
              <GlassCardHeader>
                <GlassCardTitle>About {creator.displayName}</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Bio</h4>
                    <p className="text-white/80">{creator.bio}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Subscription</h4>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                      <span className="text-white">{formatPrice(creator.subscription.price)}/month</span>
                      {creator.subscription.discount && (
                        <span className="px-2 py-1 bg-emerald-400/20 border border-emerald-400/30 rounded text-emerald-300 text-sm font-medium">
                          {creator.subscription.discount.percentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {creator.location && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Location</h4>
                      <p className="text-white/80">{creator.location}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Social Media</h4>
                    <div className="flex gap-3">
                      {creator.socialLinks?.instagram && (
                        <FrostedButton variant="ghost" size="sm">
                          Instagram
                        </FrostedButton>
                      )}
                      {creator.socialLinks?.twitter && (
                        <FrostedButton variant="ghost" size="sm">
                          Twitter
                        </FrostedButton>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </EnhancedGlassCard>
          )}
        </div>
      </div>
    </div>
  )
}