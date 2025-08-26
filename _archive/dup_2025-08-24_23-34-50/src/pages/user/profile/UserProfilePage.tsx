import React, { useState } from 'react';
import { Camera, Edit, Settings, Star, Heart, Eye, Users, Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserProfilePage = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const userStats = [
    { label: 'Posts', value: '247', icon: Eye },
    { label: 'Followers', value: '12.5K', icon: Users },
    { label: 'Following', value: '892', icon: Heart },
    { label: 'Likes', value: '156K', icon: Star }
  ];

  const recentPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1494790108755-2616c2f8b93e?w=300',
      likes: 234,
      comments: 45,
      isLiked: true
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      likes: 189,
      comments: 32,
      isLiked: false
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
      likes: 567,
      comments: 78,
      isLiked: true
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300',
      likes: 432,
      comments: 56,
      isLiked: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 ring-4 ring-purple-500/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c2f8b93e?w=400" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full p-2 bg-purple-600 hover:bg-purple-700">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sophia Chen</h1>
                    <p className="text-gray-600 mb-2">@sophiachen • Content Creator</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        New York, NY
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined March 2023
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <Button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-700 mb-4 max-w-md">
                  Fashion & lifestyle content creator ✨ Sharing my journey through style, travel, and self-discovery. 
                  Available for collaborations 💕
                </p>

                {/* Links */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center text-purple-600">
                    <LinkIcon className="h-4 w-4 mr-1" />
                    <a href="#" className="text-sm hover:underline">sophiachen.com</a>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  {userStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Icon className="h-4 w-4 text-purple-600 mr-1" />
                          <span className="font-bold text-gray-900">{stat.value}</span>
                        </div>
                        <span className="text-xs text-gray-500">{stat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recentPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
                  <div className="relative aspect-square">
                    <img 
                      src={post.image} 
                      alt="Post"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span className="text-sm">{post.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>About Sophia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Biography</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Sophia is a passionate content creator who specializes in fashion, lifestyle, and travel content. 
                    With over 3 years of experience in the industry, she has built a loyal following through authentic 
                    storytelling and high-quality visual content.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Fashion</Badge>
                    <Badge variant="secondary">Travel</Badge>
                    <Badge variant="secondary">Photography</Badge>
                    <Badge variant="secondary">Lifestyle</Badge>
                    <Badge variant="secondary">Beauty</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Achievement Highlights</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">Top Creator Award 2024</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-600">10K+ Subscribers Milestone</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">1M+ Total Views</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Summer Vibes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">My favorite summer looks and travel adventures.</p>
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-purple-600 border-2 border-white"></div>
                    ))}
                    <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +12
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Fashion Forward</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Latest fashion trends and outfit inspirations.</p>
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-green-600 border-2 border-white"></div>
                    ))}
                    <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +8
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Posted new content', time: '2 hours ago' },
                    { action: 'Liked 5 posts', time: '4 hours ago' },
                    { action: 'Started following @alexj', time: '1 day ago' },
                    { action: 'Updated profile bio', time: '2 days ago' },
                    { action: 'Created new collection', time: '3 days ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;