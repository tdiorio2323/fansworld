import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  Share2,
  Calendar,
  Tag,
  Users,
  DollarSign,
  Clock,
  Star,
  Image,
  Video,
  FileText,
  Music
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuthSystem'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ContentItem {
  id: string
  title: string
  type: 'image' | 'video' | 'audio' | 'text'
  status: 'published' | 'draft' | 'scheduled'
  visibility: 'public' | 'vip' | 'elite'
  views: number
  likes: number
  earnings: number
  publishDate: string
  thumbnail?: string
  tags: string[]
}

export default function ContentManager() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [content] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Behind the Scenes: Studio Tour',
      type: 'video',
      status: 'published',
      visibility: 'public',
      views: 12547,
      likes: 1234,
      earnings: 156.78,
      publishDate: '2024-01-15',
      tags: ['behind-scenes', 'studio', 'tour']
    },
    {
      id: '2',
      title: 'VIP Exclusive Photo Set',
      type: 'image',
      status: 'published',
      visibility: 'vip',
      views: 8932,
      likes: 892,
      earnings: 289.45,
      publishDate: '2024-01-14',
      tags: ['exclusive', 'photos', 'vip']
    },
    {
      id: '3',
      title: 'Personal Message to Fans',
      type: 'text',
      status: 'published',
      visibility: 'public',
      views: 6543,
      likes: 756,
      earnings: 45.23,
      publishDate: '2024-01-13',
      tags: ['personal', 'message', 'fans']
    },
    {
      id: '4',
      title: 'Upcoming Project Preview',
      type: 'video',
      status: 'draft',
      visibility: 'elite',
      views: 0,
      likes: 0,
      earnings: 0,
      publishDate: '2024-01-20',
      tags: ['preview', 'project', 'upcoming']
    },
    {
      id: '5',
      title: 'Live Session Recording',
      type: 'audio',
      status: 'scheduled',
      visibility: 'vip',
      views: 0,
      likes: 0,
      earnings: 0,
      publishDate: '2024-01-18',
      tags: ['live', 'session', 'recording']
    }
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'audio': return <Music className="w-4 h-4" />
      case 'text': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500'
      case 'draft': return 'bg-yellow-500'
      case 'scheduled': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public': return 'bg-gray-500'
      case 'vip': return 'bg-purple-500'
      case 'elite': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const ContentCard = ({ item }: { item: ContentItem }) => (
    <Card className="glass-morphism border-border/60 hover:scale-105 transition-all group">
      <CardContent className="p-4">
        {/* Thumbnail/Preview */}
        <div className="aspect-video bg-muted/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          {getTypeIcon(item.type)}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-2 left-2 right-2 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="secondary">
                <Eye className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getStatusColor(item.status)} text-white text-xs`}>
                {item.status}
              </Badge>
              <Badge className={`${getVisibilityColor(item.visibility)} text-white text-xs`}>
                {item.visibility}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {item.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {item.likes.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              ${item.earnings.toFixed(0)}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {new Date(item.publishDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ContentRow = ({ item }: { item: ContentItem }) => (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
      <div className="w-8 h-8 rounded bg-muted/40 flex items-center justify-center">
        {getTypeIcon(item.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{item.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={`${getStatusColor(item.status)} text-white text-xs`}>
            {item.status}
          </Badge>
          <Badge className={`${getVisibilityColor(item.visibility)} text-white text-xs`}>
            {item.visibility}
          </Badge>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {item.views.toLocaleString()}
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          {item.likes.toLocaleString()}
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          ${item.earnings.toFixed(2)}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(item.publishDate).toLocaleDateString()}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost">
          <Edit className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Eye className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background">
      {/* Header */}
      <div className="border-b border-border/60 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Content Manager</h1>
              <p className="text-muted-foreground">Create, manage, and analyze your content</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Content
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{content.length}</div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <Star className="w-3 h-3" />
                +12% this month
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {content.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
              </div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <Star className="w-3 h-3" />
                +8.2% this week
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${content.reduce((sum, item) => sum + item.earnings, 0).toFixed(2)}
              </div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <Star className="w-3 h-3" />
                +15.3% this month
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.7%</div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <Star className="w-3 h-3" />
                Above average
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="glass-morphism border-border/60 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid/List */}
        <div className="space-y-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContent.map(item => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContent.map(item => (
                <ContentRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No content found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Content
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}