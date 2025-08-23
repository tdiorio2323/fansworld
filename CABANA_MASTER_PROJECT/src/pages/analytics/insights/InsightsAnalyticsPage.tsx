import React, { useState } from 'react';
import { Brain, TrendingUp, Users, Eye, Heart, MessageSquare, Zap, Calendar, Clock, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsContent as TabsContentType, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';

const InsightsAnalyticsPage = () => {
  const [selectedInsight, setSelectedInsight] = useState('audience');

  const audienceInsights = [
    {
      title: 'Peak Engagement Windows',
      description: 'Your audience is most active between 7-9 PM EST',
      impact: 'high',
      metric: '+45% engagement',
      recommendation: 'Schedule premium content during these hours'
    },
    {
      title: 'Content Preference Shift',
      description: 'Video content is outperforming photos by 3x',
      impact: 'high',
      metric: '+180% engagement',
      recommendation: 'Increase video content frequency to 3x per week'
    },
    {
      title: 'Subscriber Growth Pattern',
      description: 'New subscribers peak on weekends',
      impact: 'medium',
      metric: '+28% conversion',
      recommendation: 'Focus promotional campaigns on Friday-Sunday'
    },
    {
      title: 'Geographic Opportunity',
      description: 'Growing audience in European markets',
      impact: 'medium',
      metric: '+67% growth',
      recommendation: 'Consider EU-friendly posting times'
    }
  ];

  const performanceRadarData = [
    { subject: 'Engagement', A: 85, fullMark: 100 },
    { subject: 'Reach', A: 72, fullMark: 100 },
    { subject: 'Conversion', A: 68, fullMark: 100 },
    { subject: 'Retention', A: 91, fullMark: 100 },
    { subject: 'Growth', A: 79, fullMark: 100 },
    { subject: 'Revenue', A: 84, fullMark: 100 }
  ];

  const contentOptimizationData = [
    { content: 'Behind the Scenes', current: 65, potential: 85, gap: 20 },
    { content: 'Tutorials', current: 78, potential: 92, gap: 14 },
    { content: 'Q&A Sessions', current: 82, potential: 89, gap: 7 },
    { content: 'Product Reviews', current: 71, potential: 88, gap: 17 },
    { content: 'Live Streams', current: 89, potential: 95, gap: 6 }
  ];

  const trendData = [
    { month: 'Jan', actual: 12500, predicted: 13200, growth: 5.6 },
    { month: 'Feb', actual: 14200, predicted: 15100, growth: 6.3 },
    { month: 'Mar', actual: 16800, predicted: 17500, growth: 4.2 },
    { month: 'Apr', actual: 18900, predicted: 19800, growth: 4.8 },
    { month: 'May', actual: 21200, predicted: 22400, growth: 5.7 },
    { month: 'Jun', actual: 24500, predicted: 25800, growth: 5.3 }
  ];

  const behaviorInsights = [
    { behavior: 'Session Duration', value: '4m 32s', change: '+18%', trend: 'up' },
    { behavior: 'Content Completion', value: '78%', change: '+12%', trend: 'up' },
    { behavior: 'Return Visits', value: '3.2x/week', change: '+5%', trend: 'up' },
    { behavior: 'Share Rate', value: '8.7%', change: '-2%', trend: 'down' },
    { behavior: 'Comment Engagement', value: '15.4%', change: '+24%', trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Insights & Intelligence
          </h1>
          <p className="text-gray-600 text-lg">AI-powered insights to optimize your content strategy</p>
        </div>

        {/* Intelligence Score */}
        <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Creator Intelligence Score</h2>
                <p className="text-purple-100 mb-4">Overall performance and optimization rating</p>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold">84/100</div>
                  <Badge className="bg-white/20 text-white">Excellent</Badge>
                </div>
              </div>
              <div className="text-right">
                <Brain className="w-16 h-16 text-white/80 mb-4" />
                <div className="space-y-1 text-sm text-purple-100">
                  <div>+12 points this month</div>
                  <div>Top 15% of creators</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="audience" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="audience" className="space-y-6">
            {/* Key Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-600" />
                    Audience Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {audienceInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                          {insight.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">{insight.metric}</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                      <p className="text-xs text-purple-600 mt-2 font-medium">{insight.recommendation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Behavior Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {behaviorInsights.map((behavior, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{behavior.behavior}</p>
                          <p className="text-2xl font-bold text-purple-600">{behavior.value}</p>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center text-sm font-medium ${
                            behavior.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingUp className={`w-4 h-4 mr-1 ${behavior.trend === 'down' ? 'rotate-180' : ''}`} />
                            {behavior.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Content Optimization Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {contentOptimizationData.map((content, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{content.content}</h3>
                        <Badge variant="outline" className="text-purple-600">
                          +{content.gap}% potential
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Performance</span>
                          <span className="font-medium">{content.current}%</span>
                        </div>
                        <Progress value={content.current} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Potential</span>
                          <span className="font-medium text-green-600">{content.potential}%</span>
                        </div>
                        <Progress value={content.potential} className="h-2 opacity-50" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={performanceRadarData}>
                    <PolarGrid stroke="#e0e7ff" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <PolarRadiusAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <Radar
                      name="Performance"
                      dataKey="A"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {performanceRadarData.map((metric, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">{metric.subject}</h3>
                    <div className="text-2xl font-bold text-purple-600 mb-1">{metric.A}%</div>
                    <Progress value={metric.A} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  Growth Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#8B5CF6" 
                      strokeWidth={3} 
                      dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                      name="Actual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                      name="Predicted"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">30-Day Forecast</h3>
                  <div className="text-2xl font-bold mb-1">+23.5%</div>
                  <p className="text-green-100 text-sm">Expected growth</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Revenue Projection</h3>
                  <div className="text-2xl font-bold mb-1">$18.2K</div>
                  <p className="text-blue-100 text-sm">Next month estimate</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Subscriber Milestone</h3>
                  <div className="text-2xl font-bold mb-1">2.5K</div>
                  <p className="text-purple-100 text-sm">Expected in 18 days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-600" />
                    Quick Wins
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50/70 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-900">Post Timing Optimization</h3>
                      <Badge className="bg-green-600">Easy</Badge>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      Shifting posts to 8 PM could increase engagement by 35%
                    </p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Apply Schedule
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50/70 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-blue-900">Hashtag Optimization</h3>
                      <Badge variant="outline" className="border-blue-600 text-blue-600">Medium</Badge>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      Using trending hashtags could boost reach by 28%
                    </p>
                    <Button size="sm" variant="outline" className="border-blue-600 text-blue-600">
                      View Suggestions
                    </Button>
                  </div>

                  <div className="p-4 bg-purple-50/70 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-purple-900">Content Series</h3>
                      <Badge variant="outline" className="border-purple-600 text-purple-600">High Impact</Badge>
                    </div>
                    <p className="text-sm text-purple-700 mb-2">
                      Creating a weekly series could increase retention by 42%
                    </p>
                    <Button size="sm" variant="outline" className="border-purple-600 text-purple-600">
                      Plan Series
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Optimization Roadmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Optimize Posting Schedule</h3>
                        <p className="text-sm text-gray-600">Expected impact: +35% engagement</p>
                        <p className="text-xs text-green-600 font-medium">Estimated completion: 1 week</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Implement Content Series</h3>
                        <p className="text-sm text-gray-600">Expected impact: +42% retention</p>
                        <p className="text-xs text-blue-600 font-medium">Estimated completion: 3 weeks</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Expand Video Content</h3>
                        <p className="text-sm text-gray-600">Expected impact: +50% reach</p>
                        <p className="text-xs text-purple-600 font-medium">Estimated completion: 6 weeks</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        4
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">International Expansion</h3>
                        <p className="text-sm text-gray-600">Expected impact: +25% audience</p>
                        <p className="text-xs text-orange-600 font-medium">Estimated completion: 12 weeks</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InsightsAnalyticsPage;