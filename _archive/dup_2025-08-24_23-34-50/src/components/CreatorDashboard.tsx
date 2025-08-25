import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  Calendar, 
  Target,
  Crown,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useCreatorApplication, useCreatorMilestones, useCreatorGoals } from "@/hooks/useCreatorApplication";
import { useNavigate } from "react-router-dom";

interface CreatorStats {
  totalEarnings: number;
  monthlyEarnings: number;
  subscribers: number;
  growthRate: number;
  applicationStatus: 'pending' | 'approved' | 'rejected' | 'not_applied';
}

export function CreatorDashboard() {
  const navigate = useNavigate();
  const { application, isLoading: applicationLoading } = useCreatorApplication();
  const { milestones, isLoading: milestonesLoading } = useCreatorMilestones();
  const { goals, isLoading: goalsLoading } = useCreatorGoals();

  const [stats, setStats] = useState<CreatorStats>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    subscribers: 0,
    growthRate: 0,
    applicationStatus: 'not_applied'
  });

  useEffect(() => {
    if (application) {
      setStats(prev => ({
        ...prev,
        applicationStatus: application.status as CreatorStats['applicationStatus']
      }));
    }
  }, [application]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Crown className="h-5 w-5 text-purple-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600';
      case 'approved':
        return 'bg-green-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-purple-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Apply Now';
    }
  };

  return (
    <div className="space-y-6">
      {/* Management Status Card */}
      <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white font-['Playfair_Display'] flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-400" />
                TD Studios Management
              </CardTitle>
              <CardDescription className="text-gray-300">
                Premium creator management application status
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(stats.applicationStatus)}
              <Badge className={`${getStatusColor(stats.applicationStatus)} text-white`}>
                {getStatusText(stats.applicationStatus)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stats.applicationStatus === 'not_applied' ? (
            <div className="text-center py-8">
              <Crown className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ready to Scale Your Career?</h3>
              <p className="text-gray-300 mb-6">
                Join elite creators who trust TD Studios to manage and grow their business
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                onClick={() => navigate('/creator-application')}
              >
                Apply for Management
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg">
                  <div className="text-2xl font-bold text-white">Stage {application?.progress_stage || 1}</div>
                  <div className="text-sm text-gray-300">of 5</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg">
                  <div className="text-2xl font-bold text-white">{application?.estimated_response_days || 3}-5 Days</div>
                  <div className="text-sm text-gray-300">Est. Response</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg">
                  <div className="text-2xl font-bold text-white">{Math.round(((application?.progress_stage || 1) / 5) * 100)}%</div>
                  <div className="text-sm text-gray-300">Complete</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Application Progress</span>
                  <span className="text-purple-400">{Math.round(((application?.progress_stage || 1) / 5) * 100)}%</span>
                </div>
                <Progress value={Math.round(((application?.progress_stage || 1) / 5) * 100)} className="h-2" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              Monthly Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats.monthlyEarnings.toLocaleString()}</div>
            <div className="text-sm text-green-400">+15% from last month</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.subscribers.toLocaleString()}</div>
            <div className="text-sm text-blue-400">+{stats.growthRate}% growth</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12.3%</div>
            <div className="text-sm text-purple-400">+2.1% increase</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              Content Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4.8/5</div>
            <div className="text-sm text-yellow-400">Excellent rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Goals and Milestones */}
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/20 border border-white/10">
          <TabsTrigger value="goals" className="text-white">Growth Goals</TabsTrigger>
          <TabsTrigger value="milestones" className="text-white">Application Milestones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals" className="space-y-4">
          {goalsLoading ? (
            <div className="text-center text-gray-300">Loading goals...</div>
          ) : goals && goals.length > 0 ? (
            goals.map((goal) => (
              <Card key={goal.id} className="backdrop-blur-xl bg-black/20 border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">{goal.title}</h3>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {goal.progress_percentage}%
                    </Badge>
                  </div>
                  <Progress value={goal.progress_percentage} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Current: {goal.current_value.toLocaleString()}</span>
                    <span>Target: {goal.target_value.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-300">No goals set yet</div>
          )}
        </TabsContent>
        
        <TabsContent value="milestones" className="space-y-4">
          {milestonesLoading ? (
            <div className="text-center text-gray-300">Loading milestones...</div>
          ) : milestones && milestones.length > 0 ? (
            milestones.map((milestone, index) => (
              <Card key={milestone.id} className="backdrop-blur-xl bg-black/20 border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{milestone.title}</h3>
                      <p className="text-sm text-gray-400">
                        {milestone.completed_date ? 
                          new Date(milestone.completed_date).toLocaleDateString() : 
                          milestone.due_date ? 
                            new Date(milestone.due_date).toLocaleDateString() : 
                            'Pending'
                        }
                      </p>
                    </div>
                    {milestone.status === 'completed' && (
                      <Badge className="bg-green-600 text-white">Completed</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-300">No milestones available</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}