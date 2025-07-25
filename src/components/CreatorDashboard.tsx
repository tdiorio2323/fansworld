import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  TrendingUp, 
  Calendar, 
  Target, 
  CheckCircle, 
  Clock,
  Star,
  Users,
  DollarSign
} from 'lucide-react';
import { useCreatorApplication } from '@/hooks/useCreatorApplication';

export function CreatorDashboard() {
  const { 
    applications,
    goals,
    milestones,
    isLoading,
    getProgressPercentage,
    getNextStepMessage,
    getApplicationStats
  } = useCreatorApplication();

  const currentApplication = applications[0]; // Get the most recent application
  const stats = getApplicationStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Creator Dashboard</h1>
          <p className="text-gray-300">Welcome to your CABANA creator journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <p className="text-gray-300 text-sm">Total submitted</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{goals.length}</div>
              <p className="text-gray-300 text-sm">Active goals</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5" />
                Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{milestones.length}</div>
              <p className="text-gray-300 text-sm">Achieved</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">$0</div>
              <p className="text-gray-300 text-sm">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Application Status */}
        {currentApplication ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Application Status
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Your current application progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Status</span>
                    <Badge 
                      variant={currentApplication.status === 'approved' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {currentApplication.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-white">{getProgressPercentage()}%</span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-2" />
                  </div>
                  
                  <div className="text-sm text-gray-300">
                    <p>{getNextStepMessage()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your creator profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Update Application
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    View Requirements
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Get Started</CardTitle>
              <CardDescription className="text-gray-300">
                Begin your CABANA creator journey by submitting your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Start Application
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Goals Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Creator Goals
            </CardTitle>
            <CardDescription className="text-gray-300">
              Track your progress and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{goal.goal_type}</h4>
                      <Badge variant="secondary">{goal.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      Target: {goal.target_value} | Current: {goal.current_value}
                    </div>
                    <Progress 
                      value={(goal.current_value / goal.target_value) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">No goals set yet</p>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Create Your First Goal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}