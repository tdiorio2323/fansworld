import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, Users, Clock, Search, Plus, Pin, 
  TrendingUp, Flame, Star, ArrowRight, Eye
} from 'lucide-react'
import { Link } from 'react-router-dom'

const ForumCategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const categories = [
    {
      id: 1,
      name: 'General Discussion',
      description: 'Talk about anything and everything creator-related',
      icon: '💬',
      topicsCount: 1247,
      postsCount: 8934,
      lastPost: {
        title: 'Tips for growing your subscriber base',
        author: 'CreatorPro23',
        time: '2 hours ago'
      },
      isHot: true
    },
    {
      id: 2,
      name: 'Content Creation',
      description: 'Share tips, techniques, and inspiration for creating amazing content',
      icon: '🎨',
      topicsCount: 892,
      postsCount: 5621,
      lastPost: {
        title: 'Best lighting setup for home studio',
        author: 'PhotoMaster',
        time: '4 hours ago'
      },
      isHot: false
    },
    {
      id: 3,
      name: 'Marketing & Promotion',
      description: 'Strategies for growing your audience and promoting your content',
      icon: '📈',
      topicsCount: 567,
      postsCount: 3412,
      lastPost: {
        title: 'Social media cross-promotion strategies',
        author: 'MarketingGuru',
        time: '6 hours ago'
      },
      isHot: true
    },
    {
      id: 4,
      name: 'Technical Support',
      description: 'Get help with platform features and technical issues',
      icon: '🛠️',
      topicsCount: 234,
      postsCount: 1876,
      lastPost: {
        title: 'Upload issues with large video files',
        author: 'TechHelper',
        time: '1 hour ago'
      },
      isHot: false
    },
    {
      id: 5,
      name: 'Success Stories',
      description: 'Celebrate wins and share your creator journey milestones',
      icon: '🏆',
      topicsCount: 189,
      postsCount: 945,
      lastPost: {
        title: 'Just hit 10K subscribers! 🎉',
        author: 'HappyCreator',
        time: '3 hours ago'
      },
      isHot: false
    },
    {
      id: 6,
      name: 'Collaborations',
      description: 'Find other creators to collaborate with on projects',
      icon: '🤝',
      topicsCount: 156,
      postsCount: 723,
      lastPost: {
        title: 'Looking for photographers in NYC area',
        author: 'NYCModel',
        time: '5 hours ago'
      },
      isHot: false
    },
    {
      id: 7,
      name: 'Platform Updates',
      description: 'Latest news, updates, and announcements from Cabana',
      icon: '📢',
      topicsCount: 45,
      postsCount: 892,
      lastPost: {
        title: 'New messaging features now available!',
        author: 'CabanaTeam',
        time: '1 day ago'
      },
      isHot: true,
      isOfficial: true
    },
    {
      id: 8,
      name: 'Off-Topic',
      description: 'Random conversations and non-creator related discussions',
      icon: '🌟',
      topicsCount: 678,
      postsCount: 4521,
      lastPost: {
        title: 'What\'s everyone watching on Netflix?',
        author: 'RandomUser',
        time: '30 minutes ago'
      },
      isHot: false
    }
  ]

  const pinnedTopics = [
    {
      id: 1,
      title: 'Welcome to the Cabana Community Forum! 📋',
      author: 'CabanaTeam',
      replies: 156,
      views: 5420,
      lastActivity: '2 days ago',
      isPinned: true,
      isLocked: false
    },
    {
      id: 2,
      title: 'Community Guidelines and Rules 📖',
      author: 'ModeratorTeam',
      replies: 23,
      views: 2890,
      lastActivity: '1 week ago',
      isPinned: true,
      isLocked: true
    }
  ]

  const trendingTopics = [
    {
      id: 1,
      title: 'Best practices for subscriber retention',
      category: 'Marketing & Promotion',
      replies: 45,
      views: 1230
    },
    {
      id: 2,
      title: 'Camera recommendations under $500',
      category: 'Content Creation',
      replies: 32,
      views: 890
    },
    {
      id: 3,
      title: 'Tax implications for creator income',
      category: 'General Discussion',
      replies: 28,
      views: 756
    }
  ]

  const filters = [
    { id: 'all', label: 'All Categories', count: categories.length },
    { id: 'hot', label: 'Hot Topics', count: categories.filter(c => c.isHot).length },
    { id: 'official', label: 'Official', count: categories.filter(c => c.isOfficial).length }
  ]

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedFilter === 'all') return matchesSearch
    if (selectedFilter === 'hot') return matchesSearch && category.isHot
    if (selectedFilter === 'official') return matchesSearch && category.isOfficial
    
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
              <p className="text-gray-600">Connect, learn, and grow with fellow creators</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
              <Link to="/forum/topics/new">
                <Plus className="h-4 w-4 mr-2" />
                New Topic
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories and topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {filters.map(filter => (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.id)}
                    className={selectedFilter === filter.id ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    {filter.label} ({filter.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Pinned Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pin className="h-5 w-5 text-purple-600" />
                  Pinned Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pinnedTopics.map(topic => (
                    <div key={topic.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Pin className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link to={`/forum/topics/${topic.id}`} className="font-medium text-gray-900 hover:text-purple-600 truncate block">
                          {topic.title}
                        </Link>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>by {topic.author}</span>
                          <span>•</span>
                          <span>{topic.replies} replies</span>
                          <span>•</span>
                          <span>{topic.views} views</span>
                          <span>•</span>
                          <span>{topic.lastActivity}</span>
                        </div>
                      </div>
                      {topic.isLocked && (
                        <Badge variant="secondary" className="text-xs">
                          Locked
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <div className="space-y-4">
              {filteredCategories.map(category => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{category.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Link 
                            to={`/forum/categories/${category.id}`} 
                            className="text-lg font-semibold text-gray-900 hover:text-purple-600"
                          >
                            {category.name}
                          </Link>
                          {category.isHot && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              <Flame className="h-3 w-3 mr-1" />
                              Hot
                            </Badge>
                          )}
                          {category.isOfficial && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              <Star className="h-3 w-3 mr-1" />
                              Official
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{category.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{category.topicsCount} topics</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{category.postsCount} posts</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {category.lastPost.title.length > 30 
                                ? category.lastPost.title.substring(0, 30) + '...'
                                : category.lastPost.title
                              }
                            </div>
                            <div className="text-xs text-gray-600">
                              by {category.lastPost.author} • {category.lastPost.time}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Forum Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Forum Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Topics</span>
                  <span className="font-semibold">4,053</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-semibold">26,924</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Online Now</span>
                  <span className="font-semibold text-green-600">89</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingTopics.map(topic => (
                    <div key={topic.id}>
                      <Link 
                        to={`/forum/topics/${topic.id}`}
                        className="font-medium text-sm text-gray-900 hover:text-purple-600 block mb-1"
                      >
                        {topic.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Badge variant="outline" className="text-xs px-1">
                          {topic.category}
                        </Badge>
                        <span>•</span>
                        <span>{topic.replies} replies</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{topic.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/forum/search">
                    <Search className="h-4 w-4 mr-2" />
                    Advanced Search
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/forum/rules">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Community Rules
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/forum/moderation">
                    <Users className="h-4 w-4 mr-2" />
                    Report Content
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumCategoriesPage