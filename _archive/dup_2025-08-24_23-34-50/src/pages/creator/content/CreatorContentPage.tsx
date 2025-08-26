import React, { useState } from 'react';
import { Plus, Upload, Edit3, Eye, Heart, MessageCircle, Share2, MoreVertical, Filter, Search, Calendar, Video, Image, FileText, Music } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CreatorContentPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const contentItems = [
    {
      id: 1,
      type: 'video',
      title: 'Behind the Scenes: My Morning Routine',
      thumbnail: '/api/placeholder/300/200',
      status: 'published',
      views: 15420,
      likes: 892,
      comments: 156,
      publishedAt: '2024-01-15',
      revenue: 245.50,
      engagement: 8.2
    },
    {
      id: 2,
      type: 'image',
      title: 'Exclusive Photoshoot Preview',
      thumbnail: '/api/placeholder/300/200',
      status: 'scheduled',
      views: 0,
      likes: 0,
      comments: 0,
      publishedAt: '2024-01-20',
      revenue: 0,
      engagement: 0
    },
    {
      id: 3,
      type: 'audio',
      title: 'Personal Message to My Fans',
      thumbnail: '/api/placeholder/300/200',
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      publishedAt: null,
      revenue: 0,
      engagement: 0
    },
    {
      id: 4,
      type: 'text',
      title: 'My Thoughts on Recent Events',
      thumbnail: '/api/placeholder/300/200',
      status: 'published',
      views: 8950,
      likes: 654,
      comments: 89,
      publishedAt: '2024-01-12',
      revenue: 156.75,
      engagement: 9.1
    },
    {
      id: 5,
      type: 'video',
      title: 'Live Stream Highlights',
      thumbnail: '/api/placeholder/300/200',
      status: 'published',
      views: 23100,
      likes: 1456,
      comments: 234,
      publishedAt: '2024-01-10',
      revenue: 389.25,
      engagement: 7.8
    },
    {
      id: 6,
      type: 'image',
      title: 'Workout Routine Guide',
      thumbnail: '/api/placeholder/300/200',
      status: 'published',
      views: 12300,
      likes: 789,
      comments: 67,
      publishedAt: '2024-01-08',
      revenue: 198.50,
      engagement: 8.9
    }
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: 'bg-green-500/20 text-green-300 border-green-500/30',
      draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  const filteredContent = contentItems.filter(item => 
    activeFilter === 'all' || item.status === activeFilter || item.type === activeFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Content Manager</h1>
          <p className="text-purple-200">Create, manage, and optimize your content</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Total Content</p>
                  <p className="text-2xl font-bold text-white">248</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Published</p>
                  <p className="text-2xl font-bold text-white">189</p>
                </div>
                <Eye className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Drafts</p>
                  <p className="text-2xl font-bold text-white">43</p>
                </div>
                <Edit3 className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Scheduled</p>
                  <p className="text-2xl font-bold text-white">16</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Content
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Upload
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    placeholder="Search content..." 
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'published', 'draft', 'scheduled', 'video', 'image', 'audio', 'text'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              className={activeFilter === filter 
                ? "bg-gradient-to-r from-purple-600 to-pink-600" 
                : "border-white/20 text-white hover:bg-white/10"
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="relative">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={`${getStatusBadge(item.status)} border`}>
                    {item.status}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                    {getContentIcon(item.type)}
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
                
                <div className="flex items-center justify-between text-sm text-purple-200 mb-3">
                  <span>{item.publishedAt || 'Not published'}</span>
                  <span>{item.type.toUpperCase()}</span>
                </div>

                {item.status === 'published' && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center text-blue-400">
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="text-xs">{item.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center text-pink-400">
                        <Heart className="w-4 h-4 mr-1" />
                        <span className="text-xs">{item.likes}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center text-green-400">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">{item.comments}</span>
                      </div>
                    </div>
                  </div>
                )}

                {item.revenue > 0 && (
                  <div className="flex justify-between items-center mb-3 p-2 bg-white/5 rounded-lg">
                    <span className="text-purple-200 text-sm">Revenue</span>
                    <span className="text-green-400 font-semibold">${item.revenue}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
              <p className="text-purple-200 mb-4">Try adjusting your filters or create new content</p>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Content
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreatorContentPage;