import React from 'react';
import { Trophy, Star, Crown, Award, Target, Zap, Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const AchievementsPage = () => {
  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your profile setup',
      icon: Star,
      progress: 100,
      unlocked: true,
      points: 50,
      category: 'Getting Started'
    },
    {
      id: 2,
      title: 'Content Creator',
      description: 'Upload your first piece of content',
      icon: Zap,
      progress: 100,
      unlocked: true,
      points: 100,
      category: 'Content'
    },
    {
      id: 3,
      title: 'Popular Creator',
      description: 'Reach 1,000 subscribers',
      icon: Crown,
      progress: 75,
      unlocked: false,
      points: 500,
      category: 'Growth'
    },
    {
      id: 4,
      title: 'Top Earner',
      description: 'Earn $1,000 in a single month',
      icon: Trophy,
      progress: 45,
      unlocked: false,
      points: 1000,
      category: 'Earnings'
    },
    {
      id: 5,
      title: 'Community Favorite',
      description: 'Receive 100 likes on a single post',
      icon: Heart,
      progress: 80,
      unlocked: false,
      points: 200,
      category: 'Engagement'
    },
    {
      id: 6,
      title: 'Consistent Creator',
      description: 'Post content for 30 consecutive days',
      icon: Target,
      progress: 20,
      unlocked: false,
      points: 750,
      category: 'Consistency'
    }
  ];

  const categories = ['All', 'Getting Started', 'Content', 'Growth', 'Earnings', 'Engagement', 'Consistency'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredAchievements = selectedCategory === 'All' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">Unlock rewards and showcase your CABANA journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Total Points</p>
                  <p className="text-3xl font-bold">{totalPoints.toLocaleString()}</p>
                </div>
                <Award className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm mb-1">Unlocked</p>
                  <p className="text-3xl font-bold">{unlockedCount}/{achievements.length}</p>
                </div>
                <Trophy className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Completion</p>
                  <p className="text-3xl font-bold">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-purple-600' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <Card 
                key={achievement.id} 
                className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg ${
                  achievement.unlocked ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${
                      achievement.unlocked ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant={achievement.unlocked ? 'default' : 'secondary'}>
                      {achievement.points} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className={`font-semibold mb-2 ${
                      achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className={achievement.unlocked ? 'text-purple-600 font-medium' : 'text-gray-500'}>
                        {achievement.progress}%
                      </span>
                    </div>
                    <Progress 
                      value={achievement.progress} 
                      className={`h-2 ${achievement.unlocked ? 'bg-purple-100' : ''}`}
                    />
                  </div>
                  
                  <Badge variant="outline" className="mt-3 text-xs">
                    {achievement.category}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Achievement Tips */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Target className="h-5 w-5 mr-2" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
              <div>
                <h4 className="font-semibold mb-2">Maximize Your Points:</h4>
                <ul className="space-y-1">
                  <li>• Complete profile setup for easy points</li>
                  <li>• Post consistently to unlock bonuses</li>
                  <li>• Engage with your community regularly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Unlock Premium Rewards:</h4>
                <ul className="space-y-1">
                  <li>• Higher tier achievements give exclusive badges</li>
                  <li>• Premium features unlock at milestone points</li>
                  <li>• Special recognition in the community</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AchievementsPage;