import React from 'react';
import { Camera, Video, Mic, Image, FileText, Settings, Upload, Edit, Palette, Zap, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CreatorToolsPage = () => {
  const tools = [
    {
      id: 'content-studio',
      name: 'Content Studio',
      description: 'Create and edit photos, videos, and posts',
      icon: Camera,
      color: 'from-blue-500 to-cyan-500',
      features: ['Photo Editor', 'Video Tools', 'Filters & Effects']
    },
    {
      id: 'live-streaming',
      name: 'Live Streaming',
      description: 'Go live and connect with fans in real-time',
      icon: Video,
      color: 'from-red-500 to-pink-500',
      features: ['HD Streaming', 'Chat Integration', 'Recording']
    },
    {
      id: 'audio-tools',
      name: 'Audio Studio',
      description: 'Record podcasts and audio content',
      icon: Mic,
      color: 'from-purple-500 to-indigo-500',
      features: ['Audio Recording', 'Sound Effects', 'Voice Enhancement']
    },
    {
      id: 'scheduler',
      name: 'Content Scheduler',
      description: 'Plan and schedule your content releases',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      features: ['Auto Posting', 'Calendar View', 'Time Optimization']
    },
    {
      id: 'analytics',
      name: 'Performance Analytics',
      description: 'Track engagement and revenue metrics',
      icon: BarChart3,
      color: 'from-orange-500 to-yellow-500',
      features: ['Revenue Tracking', 'Audience Insights', 'Growth Metrics']
    },
    {
      id: 'branding',
      name: 'Brand Kit',
      description: 'Customize your profile and branding',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      features: ['Logo Creator', 'Color Themes', 'Template Library']
    }
  ];

  const quickActions = [
    { name: 'Upload Content', icon: Upload, action: 'upload' },
    { name: 'Start Live Stream', icon: Video, action: 'live' },
    { name: 'Edit Profile', icon: Edit, action: 'profile' },
    { name: 'View Analytics', icon: BarChart3, action: 'analytics' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Creator Tools
          </h1>
          <p className="text-gray-600 text-lg">Everything you need to create amazing content and grow your audience</p>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.action}
                    className="h-20 flex flex-col space-y-2 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm">{action.name}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Features:</p>
                      <div className="space-y-1">
                        {tool.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className={`w-full bg-gradient-to-r ${tool.color} text-white hover:opacity-90 transition-opacity`}>
                      Launch Tool
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tips & Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Creator Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">Consistent Posting</p>
                    <p className="text-sm text-purple-100">Post regularly to keep your audience engaged</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">High Quality Content</p>
                    <p className="text-sm text-purple-100">Use good lighting and clear audio for best results</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Engage with Fans</p>
                    <p className="text-sm text-purple-100">Respond to messages and comments to build relationships</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-800">Resource Center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-600 hover:bg-purple-50">
                  <FileText className="w-4 h-4 mr-3" />
                  Creator Guidelines
                </Button>
                
                <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Video className="w-4 h-4 mr-3" />
                  Video Tutorials
                </Button>
                
                <Button variant="outline" className="w-full justify-start border-green-200 text-green-600 hover:bg-green-50">
                  <Settings className="w-4 h-4 mr-3" />
                  Best Practices
                </Button>
                
                <Button variant="outline" className="w-full justify-start border-pink-200 text-pink-600 hover:bg-pink-50">
                  <Image className="w-4 h-4 mr-3" />
                  Photo Guidelines
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Need help? Our support team is here for you!</p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorToolsPage;