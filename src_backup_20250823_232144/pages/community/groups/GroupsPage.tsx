import React, { useState } from 'react';
import { Users, MessageCircle, Settings, Crown, UserPlus, Search, Plus, Globe, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GroupsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const myGroups = [
    {
      id: 1,
      name: 'Content Creators United',
      description: 'A community for creators to share tips and collaborate',
      members: 1247,
      posts: 856,
      category: 'General',
      privacy: 'public',
      role: 'admin',
      lastActivity: '2 hours ago',
      isActive: true
    },
    {
      id: 2,
      name: 'YouTube Growth Hackers',
      description: 'Strategies and tactics for growing your YouTube channel',
      members: 892,
      posts: 234,
      category: 'YouTube',
      privacy: 'private',
      role: 'moderator',
      lastActivity: '1 day ago',
      isActive: true
    },
    {
      id: 3,
      name: 'Brand Partnership Hub',
      description: 'Connect with brands and discuss partnership opportunities',
      members: 567,
      posts: 123,
      category: 'Business',
      privacy: 'public',
      role: 'member',
      lastActivity: '3 days ago',
      isActive: false
    }
  ];

  const discoverGroups = [
    {
      id: 4,
      name: 'TikTok Trends & Tips',
      description: 'Stay ahead of the latest TikTok trends and growth strategies',
      members: 2156,
      posts: 1234,
      category: 'TikTok',
      privacy: 'public',
      isMember: false
    },
    {
      id: 5,
      name: 'Photography Creators',
      description: 'Share your work and learn from fellow photographers',
      members: 678,
      posts: 445,
      category: 'Photography',
      privacy: 'public',
      isMember: false
    },
    {
      id: 6,
      name: 'Podcast Network',
      description: 'Connect with other podcasters and grow your audience',
      members: 389,
      posts: 167,
      category: 'Podcast',
      privacy: 'private',
      isMember: false
    }
  ];

  const groupCategories = [
    { name: 'All', count: 156 },
    { name: 'General', count: 45 },
    { name: 'YouTube', count: 32 },
    { name: 'TikTok', count: 28 },
    { name: 'Instagram', count: 24 },
    { name: 'Business', count: 18 },
    { name: 'Photography', count: 9 }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'General': return 'bg-purple-100 text-purple-800';
      case 'YouTube': return 'bg-red-100 text-red-800';
      case 'TikTok': return 'bg-pink-100 text-pink-800';
      case 'Instagram': return 'bg-gradient-100 text-gradient-800';
      case 'Business': return 'bg-blue-100 text-blue-800';
      case 'Photography': return 'bg-green-100 text-green-800';
      case 'Podcast': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Community Groups
          </h1>
          <p className="text-gray-600 text-lg">Join groups to connect with like-minded creators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">My Groups</p>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                  <p className="text-xs text-purple-500">Active memberships</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Members</p>
                  <p className="text-2xl font-bold text-blue-600">2,706</p>
                  <p className="text-xs text-blue-500">Across all groups</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Posts Created</p>
                  <p className="text-2xl font-bold text-green-600">47</p>
                  <p className="text-xs text-green-500">This month</p>
                </div>
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Admin Roles</p>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                  <p className="text-xs text-orange-500">Groups managed</p>
                </div>
                <Settings className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-0"
              />
            </div>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>

        <Tabs defaultValue="mygroups" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="mygroups">My Groups</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="mygroups" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>My Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myGroups.map((group) => (
                    <div key={group.id} className="p-6 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">{group.name}</h3>
                            {group.role === 'admin' && <Crown className="w-5 h-5 text-yellow-500" />}
                            {group.privacy === 'private' ? 
                              <Lock className="w-4 h-4 text-gray-500" /> : 
                              <Globe className="w-4 h-4 text-gray-500" />
                            }
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                          
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-1" />
                              {group.members.toLocaleString()} members
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {group.posts} posts
                            </div>
                            <span className="text-sm text-gray-500">Last activity: {group.lastActivity}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge className={getRoleColor(group.role)}>
                              {group.role}
                            </Badge>
                            <Badge className={getCategoryColor(group.category)}>
                              {group.category}
                            </Badge>
                            {group.isActive && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                          </div>
                        </div>

                        <div className="ml-4 space-y-2">
                          <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            Open Group
                          </Button>
                          {group.role === 'admin' && (
                            <Button size="sm" variant="outline" className="w-full border-blue-200 text-blue-600">
                              <Settings className="w-4 h-4 mr-1" />
                              Manage
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Discover New Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {discoverGroups.map((group) => (
                    <div key={group.id} className="p-6 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">{group.name}</h3>
                            {group.privacy === 'private' ? 
                              <Lock className="w-4 h-4 text-gray-500" /> : 
                              <Globe className="w-4 h-4 text-gray-500" />
                            }
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                          
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-1" />
                              {group.members.toLocaleString()} members
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {group.posts} posts
                            </div>
                          </div>

                          <Badge className={getCategoryColor(group.category)}>
                            {group.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <UserPlus className="w-4 h-4 mr-1" />
                          Join Group
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Group Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupCategories.map((category, index) => (
                    <div key={index} className="p-4 bg-gray-50/70 rounded-lg hover:bg-gray-100/70 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500">{category.count} groups</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Create Your Own Group</h3>
                  <p className="text-purple-100 mb-4">Build a community around your niche and interests</p>
                  <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Creating
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Join the Conversation</h3>
                  <p className="text-blue-100 mb-4">Connect with thousands of creators worldwide</p>
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Explore Groups
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GroupsPage;