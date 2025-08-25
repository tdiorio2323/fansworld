/**
 * Tip Goal Progress Component - Real-time progress tracking with animations
 * FansWorld Creator Platform
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Clock, Target, Gift, Zap } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useFlag } from '@/hooks/useFlag';
import { tipGoalsService, type TipGoal, type TipGoalContribution, type TipGoalMilestone } from '../services/tipGoalsService';

interface TipGoalProgressProps {
  goalId: string;
  showContributions?: boolean;
  showMilestones?: boolean;
  onContribute?: () => void;
  className?: string;
}

export function TipGoalProgress({ 
  goalId, 
  showContributions = false, 
  showMilestones = false,
  onContribute,
  className 
}: TipGoalProgressProps) {
  const { isEnabled: tipGoalsEnabled } = useFlag('TIP_GOALS_ENABLED');
  const { isEnabled: animationsEnabled } = useFlag('TIP_GOALS_ANIMATIONS');
  
  const [goalData, setGoalData] = useState<{
    goal: TipGoal;
    contributions: TipGoalContribution[];
    milestones: TipGoalMilestone[];
    progressPercent: number;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [celebratingMilestone, setCelebratingMilestone] = useState<TipGoalMilestone | null>(null);

  useEffect(() => {
    if (!tipGoalsEnabled) return;
    loadGoalData();
  }, [goalId, tipGoalsEnabled]);

  const loadGoalData = async () => {
    try {
      const data = await tipGoalsService.getGoalWithContributions(goalId);
      setGoalData(data);
    } catch (error) {
      console.error('Failed to load goal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tipGoalsEnabled || isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!goalData) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-gray-500">
          Goal not found
        </CardContent>
      </Card>
    );
  }

  const { goal, contributions, milestones, progressPercent } = goalData;
  const timeRemaining = tipGoalsService.getTimeRemaining(goal.ends_at);
  const isCompleted = progressPercent >= 100;
  const nextMilestone = milestones.find(m => !m.is_reached);

  const triggerCelebration = (milestone: TipGoalMilestone) => {
    if (!animationsEnabled) return;
    setCelebratingMilestone(milestone);
    setTimeout(() => setCelebratingMilestone(null), 3000);
  };

  const getProgressColor = () => {
    if (isCompleted) return 'from-green-500 to-emerald-600';
    if (progressPercent > 75) return 'from-blue-500 to-purple-600';
    if (progressPercent > 50) return 'from-yellow-500 to-orange-600';
    if (progressPercent > 25) return 'from-pink-500 to-red-600';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Celebration Animation */}
      <AnimatePresence>
        {celebratingMilestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-lg"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              🎉
            </motion.div>
            <div className="ml-4 text-white text-center">
              <h3 className="text-xl font-bold">{celebratingMilestone.title}</h3>
              <p className="text-sm opacity-90">{celebratingMilestone.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {goal.emoji && <span className="text-lg">{goal.emoji}</span>}
                <span className="truncate">{goal.title}</span>
                {isCompleted && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Target className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </CardTitle>
              {goal.description && (
                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {tipGoalsService.formatAmount(goal.current_amount_cents)}
              </span>
              <span className="text-gray-500">
                of {tipGoalsService.formatAmount(goal.target_amount_cents)}
              </span>
            </div>
            
            <div className="relative">
              <Progress 
                value={progressPercent} 
                className="h-3"
              />
              <motion.div
                className={`absolute inset-0 h-3 bg-gradient-to-r ${getProgressColor()} rounded-full opacity-80`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>{progressPercent.toFixed(1)}% complete</span>
              {!isCompleted && nextMilestone && (
                <span className="flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Next: {nextMilestone.percentage}%
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-500 mb-1">
                <Users className="w-4 h-4 mr-1" />
              </div>
              <div className="font-semibold">{goal.total_contributors}</div>
              <div className="text-xs text-gray-500">Contributors</div>
            </div>
            
            {!timeRemaining.isExpired && goal.ends_at && (
              <div className="text-center">
                <div className="flex items-center justify-center text-gray-500 mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                </div>
                <div className="font-semibold">
                  {timeRemaining.days > 0 ? `${timeRemaining.days}d` : `${timeRemaining.hours}h`}
                </div>
                <div className="text-xs text-gray-500">Remaining</div>
              </div>
            )}
            
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-500 mb-1">
                <Gift className="w-4 h-4 mr-1" />
              </div>
              <div className="font-semibold">{contributions.length}</div>
              <div className="text-xs text-gray-500">Tips</div>
            </div>
          </div>

          {/* Milestones */}
          {showMilestones && milestones.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
              <div className="grid grid-cols-2 gap-2">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`flex items-center p-2 rounded-lg border ${
                      milestone.is_reached
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                      milestone.is_reached ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {milestone.is_reached ? (
                        <Sparkles className="w-3 h-3 text-white" />
                      ) : (
                        <span className="text-xs text-white font-bold">
                          {milestone.percentage}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{milestone.title}</div>
                      <div className="text-xs text-gray-500">{milestone.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Contributions */}
          {showContributions && contributions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Contributors</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {contributions.slice(0, 5).map((contribution) => (
                  <div key={contribution.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {contribution.is_anonymous ? '?' : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-2 flex-1">
                        <div className="text-xs font-medium">
                          {contribution.is_anonymous ? 'Anonymous' : 'Supporter'}
                        </div>
                        {contribution.message && (
                          <div className="text-xs text-gray-500 truncate">
                            "{contribution.message}"
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tipGoalsService.formatAmount(contribution.amount_cents)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contribute Button */}
          {onContribute && !isCompleted && (
            <Button 
              onClick={onContribute}
              className={`w-full bg-gradient-to-r ${getProgressColor().replace('from-', 'from-').replace('to-', 'to-')} hover:opacity-90`}
            >
              <Gift className="w-4 h-4 mr-2" />
              Contribute to Goal
            </Button>
          )}

          {isCompleted && goal.celebration_message && (
            <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="text-lg mb-1">🎊</div>
              <p className="text-sm font-medium text-green-800">
                {goal.celebration_message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}