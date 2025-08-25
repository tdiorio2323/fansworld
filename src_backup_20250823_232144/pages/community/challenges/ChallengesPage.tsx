import React, { useState } from 'react';
import { Trophy, Users, Calendar, Target, Award, TrendingUp, Plus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ChallengesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activeChallenges = [
    {
      id: 1,
      title: '30-Day Content Creator Challenge',
      description: 'Create and publish content daily for 30 consecutive days',
      category: 'creativity',
      difficulty: 'Medium',
      participants: 1247,
      timeLeft: '12 days',
      reward: 500,
      progress: 67,
      status: 'active'
    },
    {
      id: 2,
      title: 'Viral Video Challenge',
      description: 'Create a video that reaches 100K views within 7 days',
      category: 'viral',
      difficulty: 'Hard',
      participants: 892,
      timeLeft: '3 days',
      reward: 1000,
      progress: 45,
      status: 'active'
    },
    {
      id: 3,
      title: 'Community Builder Challenge',
      description: 'Gain 1000 new followers this month',
      category: 'growth',
      difficulty: 'Easy',
      participants: 2156,
      timeLeft: '18 days',
      reward: 250,
      progress: 78,
      status: 'active'
    }
  ];

  const completedChallenges = [
    {
      id: 4,
      title: 'Weekly Collaboration Challenge',
      participants: 567,
      reward: 300,
      completionDate: '2024-06-15',
      rank: 23
    },
    {
      id: 5,
      title: 'Brand Partnership Challenge',
      participants: 234,
      reward: 750,
      completionDate: '2024-05-20',
      rank: 8
    }
  ];

  const challengeCategories = [
    { id: 'all', name: 'All Challenges', count: 15, color: 'from-purple-500 to-pink-500' },
    { id: 'creativity', name: 'Creativity', count: 5, color: 'from-blue-500 to-cyan-500' },
    { id: 'growth', name: 'Growth', count: 4, color: 'from-green-500 to-emerald-500' },
    { id: 'viral', name: 'Viral', count: 3, color: 'from-orange-500 to-red-500' },
    { id: 'collaboration', name: 'Collaboration', count: 3, color: 'from-pink-500 to-purple-500' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Community Challenges
          </h1>
          <p className="text-gray-600 text-lg">Compete, grow, and earn rewards with fellow creators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Challenges</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-xs text-purple-500">Running now</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Participants</p>
                  <p className="text-2xl font-bold text-blue-600">4,295</p>
                  <p className="text-xs text-blue-500">Creators competing</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rewards Earned</p>
                  <p className="text-2xl font-bold text-green-600">$8,450</p>
                  <p className="text-xs text-green-500">This month</p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Rank</p>
                  <p className="text-2xl font-bold text-orange-600">#127</p>
                  <p className="text-xs text-orange-500">Global leaderboard</p>
                </div>
                <Trophy className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {challengeCategories.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedCategory === category.id 
                  ? 'ring-2 ring-purple-400 bg-white/90' 
                  : 'bg-white/70 hover:bg-white/80'
              } backdrop-blur-sm border-0 shadow-xl`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.count} challenges</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="active">Active Challenges</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Challenges</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Challenge
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activeChallenges.map((challenge) => (
                    <div key={challenge.id} className="p-6 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-2">{challenge.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                          <div className="flex items-center space-x-3">
                            <Badge className={getDifficultyColor(challenge.difficulty)}>
                              {challenge.difficulty}
                            </Badge>
                            <Badge variant="outline">{challenge.category}</Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-1" />
                              {challenge.participants} participants
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {challenge.timeLeft} left
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-2">
                            <Award className="w-5 h-5 text-yellow-500 mr-1" />
                            <span className="font-semibold text-yellow-600">${challenge.reward}</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{challenge.status}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Your Progress</span>
                          <span className="font-medium">{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-3" />
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          Join Challenge
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Completed Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedChallenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                          <p className="text-sm text-gray-600">Completed on {challenge.completionDate}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              Rank #{challenge.rank}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-1" />
                              {challenge.participants} participants
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Award className="w-5 h-5 text-yellow-500 mr-1" />
                            <span className="font-semibold text-yellow-600">${challenge.reward}</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800 mt-1">Earned</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Challenge Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: 'Sarah Creator', points: 2450, challenges: 12, badge: 'Champion' },
                    { rank: 2, name: 'Mike Viral', points: 2340, challenges: 11, badge: 'Master' },
                    { rank: 3, name: 'Emma Growth', points: 2180, challenges: 10, badge: 'Expert' },
                    { rank: 4, name: 'Alex Content', points: 1950, challenges: 9, badge: 'Pro' },
                    { rank: 5, name: 'Jordan Brand', points: 1780, challenges: 8, badge: 'Advanced' }
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          user.rank === 1 ? 'bg-yellow-500' :
                          user.rank === 2 ? 'bg-gray-400' :
                          user.rank === 3 ? 'bg-orange-500' :
                          'bg-purple-500'
                        }`}>
                          #{user.rank}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.challenges} challenges completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold">{user.points}</span>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">{user.badge}</Badge>
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

export default ChallengesPage;