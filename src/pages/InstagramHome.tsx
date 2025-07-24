import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  Search, 
  Plus, 
  Settings, 
  User, 
  Crown,
  Sparkles,
  TrendingUp,
  Fire
} from 'lucide-react'

interface Creator {
  id: string
  username: string
  displayName: string
  avatar: string
  isVerified: boolean
  followerCount: number
  isFollowing: boolean
}

interface Post {
  id: string
  creator: Creator
  content: string
  imageUrl: string
  likeCount: number
  commentCount: number
  timeAgo: string
  isLiked: boolean
  isBookmarked: boolean
}

const mockCreators: Creator[] = [
  {
    id: '1',
    username: 'luxurylifestyle',
    displayName: 'Luxury Lifestyle',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    isVerified: true,
    followerCount: 245000,
    isFollowing: false
  },
  {
    id: '2',
    username: 'artisancreator',
    displayName: 'Artisan Creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isVerified: true,
    followerCount: 180000,
    isFollowing: true
  },
  {
    id: '3',
    username: 'fashionista',
    displayName: 'Fashion Elite',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    isVerified: true,
    followerCount: 320000,
    isFollowing: false
  }
]

const mockPosts: Post[] = [
  {
    id: '1',
    creator: mockCreators[0],
    content: 'Behind the scenes of my latest luxury photoshoot ✨ Exclusive content available for VIP subscribers! 💎',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
    likeCount: 1247,
    commentCount: 89,
    timeAgo: '2h',
    isLiked: false,
    isBookmarked: false
  },
  {
    id: '2',
    creator: mockCreators[1],
    content: 'Creating art in my private studio. Watch the full process exclusively on my premium tier 🎨',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop',
    likeCount: 892,
    commentCount: 43,
    timeAgo: '4h',
    isLiked: true,
    isBookmarked: true
  }
]

export default function InstagramHome() {
  const { user, logout } = useAuth()
  const [posts, setPosts] = useState(mockPosts)
  const [creators, setCreators] = useState(mockCreators)

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
          }
        : post
    ))
  }

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
  }

  const handleFollow = (creatorId: string) => {
    setCreators(creators.map(creator =>
      creator.id === creatorId
        ? { ...creator, isFollowing: !creator.isFollowing }
        : creator
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/home" className="text-2xl font-bold text-gradient flex items-center gap-2">
              <Crown className="h-8 w-8" />
              Fansworld
            </Link>
            
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Search creators..." 
                  className="pl-12 bg-background/50 border-border/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Plus className="h-6 w-6" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.displayName}</p>
                  <p className="text-xs text-muted-foreground">@{user?.username}</p>
                </div>
                <div className="creator-avatar-chrome h-10 w-10">
                  <img 
                    src={user?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150`}
                    alt={user?.displayName}
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={logout}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex gap-8 p-6">
        {/* Sidebar */}
        <aside className="w-80 space-y-6">
          {/* Trending Creators */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Fire className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-lg">Trending Creators</h3>
            </div>
            
            <div className="space-y-4">
              {creators.map((creator) => (
                <div key={creator.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="creator-avatar-chrome h-12 w-12">
                      <img 
                        src={creator.avatar}
                        alt={creator.displayName}
                        className="rounded-full w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">{creator.displayName}</p>
                        {creator.isVerified && (
                          <Crown className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">@{creator.username}</p>
                      <p className="text-xs text-muted-foreground">{creator.followerCount.toLocaleString()} followers</p>
                    </div>
                  </div>
                  
                  <Button
                    variant={creator.isFollowing ? "glass" : "default"}
                    size="sm"
                    onClick={() => handleFollow(creator.id)}
                    className="text-xs"
                  >
                    {creator.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card variant="crystal" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Your Impact</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Followers</span>
                <span className="font-semibold text-primary">{user?.followerCount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Following</span>
                <span className="font-semibold">{user?.followingCount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Engagement</span>
                <span className="font-semibold text-accent">4.2%</span>
              </div>
            </div>
          </Card>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 space-y-8">
          {posts.map((post) => (
            <Card key={post.id} variant="glass" className="overflow-hidden">
              {/* Post Header */}
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="creator-avatar-chrome h-12 w-12">
                      <img 
                        src={post.creator.avatar}
                        alt={post.creator.displayName}
                        className="rounded-full w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{post.creator.displayName}</h4>
                        {post.creator.isVerified && (
                          <Crown className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{post.creator.username} • {post.timeAgo}</p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Post Content */}
                <p className="mb-4 text-foreground/90">{post.content}</p>
                
                {/* Post Image */}
                <div className="media-tile mb-4">
                  <img 
                    src={post.imageUrl}
                    alt="Post content"
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border/20">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`gap-2 ${post.isLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likeCount}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-5 w-5" />
                      {post.commentCount}
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmark(post.id)}
                    className={post.isBookmarked ? 'text-accent' : ''}
                  >
                    <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Load More */}
          <div className="text-center py-8">
            <Button variant="glass" size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Load More Premium Content
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}