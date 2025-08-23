/**
 * Tip Goals Service - Progress tracking and milestone celebrations
 * FansWorld Creator Platform
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type TipGoal = Database['public']['Tables']['tip_goals']['Row'];
export type TipGoalContribution = Database['public']['Tables']['tip_goal_contributions']['Row'];
export type TipGoalMilestone = Database['public']['Tables']['tip_goal_milestones']['Row'];

export interface CreateTipGoalData {
  title: string;
  description?: string;
  targetAmountCents: number;
  emoji?: string;
  colorHex?: string;
  imageUrl?: string;
  startsAt?: string;
  endsAt?: string;
  isPublic?: boolean;
  showProgress?: boolean;
  celebrationMessage?: string;
  metadata?: Record<string, any>;
}

export interface ContributeTipData {
  goalId: string;
  amountCents: number;
  message?: string;
  isAnonymous?: boolean;
  paymentIntentId?: string;
}

export interface TipGoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalRaised: number;
  totalContributors: number;
  averageContribution: number;
  topGoals: Array<{
    goal: TipGoal;
    progressPercent: number;
    contributorCount: number;
  }>;
}

class TipGoalsService {
  /**
   * Create a new tip goal
   */
  async createGoal(creatorId: string, data: CreateTipGoalData): Promise<TipGoal> {
    const { data: goal, error } = await supabase
      .from('tip_goals')
      .insert({
        creator_id: creatorId,
        title: data.title,
        description: data.description,
        target_amount_cents: data.targetAmountCents,
        emoji: data.emoji,
        color_hex: data.colorHex || '#FF6B35',
        image_url: data.imageUrl,
        starts_at: data.startsAt,
        ends_at: data.endsAt,
        is_public: data.isPublic !== false, // Default to true
        show_progress: data.showProgress !== false, // Default to true
        celebration_message: data.celebrationMessage,
        metadata: data.metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create tip goal: ${error.message}`);
    }

    // Create default milestones (25%, 50%, 75%, 100%)
    await this.createDefaultMilestones(goal.id, data.targetAmountCents);

    return goal;
  }

  /**
   * Get tip goals for a creator
   */
  async getCreatorGoals(creatorId: string, includeInactive = false): Promise<TipGoal[]> {
    let query = supabase
      .from('tip_goals')
      .select('*')
      .eq('creator_id', creatorId);

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data: goals, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch creator goals: ${error.message}`);
    }

    return goals || [];
  }

  /**
   * Get public tip goals (for discovery)
   */
  async getPublicGoals(limit = 20): Promise<Array<TipGoal & { progressPercent: number }>> {
    const { data: goals, error } = await supabase
      .from('tip_goals')
      .select('*')
      .eq('is_public', true)
      .eq('is_active', true)
      .or('ends_at.is.null,ends_at.gte.now()')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch public goals: ${error.message}`);
    }

    // Calculate progress percentage for each goal
    const goalsWithProgress = (goals || []).map(goal => ({
      ...goal,
      progressPercent: goal.target_amount_cents > 0 
        ? Math.min((goal.current_amount_cents / goal.target_amount_cents) * 100, 100)
        : 0
    }));

    return goalsWithProgress;
  }

  /**
   * Get a specific tip goal with contributions
   */
  async getGoalWithContributions(goalId: string): Promise<{
    goal: TipGoal;
    contributions: TipGoalContribution[];
    milestones: TipGoalMilestone[];
    progressPercent: number;
  } | null> {
    const { data: goal, error: goalError } = await supabase
      .from('tip_goals')
      .select('*')
      .eq('id', goalId)
      .single();

    if (goalError || !goal) {
      return null;
    }

    const [contributionsResult, milestonesResult] = await Promise.all([
      supabase
        .from('tip_goal_contributions')
        .select('*')
        .eq('goal_id', goalId)
        .eq('payment_status', 'completed')
        .order('contributed_at', { ascending: false }),
      supabase
        .from('tip_goal_milestones')
        .select('*')
        .eq('goal_id', goalId)
        .order('percentage', { ascending: true })
    ]);

    const contributions = contributionsResult.data || [];
    const milestones = milestonesResult.data || [];
    const progressPercent = goal.target_amount_cents > 0 
      ? Math.min((goal.current_amount_cents / goal.target_amount_cents) * 100, 100)
      : 0;

    return {
      goal,
      contributions,
      milestones,
      progressPercent
    };
  }

  /**
   * Contribute to a tip goal
   */
  async contributeToGoal(
    userId: string,
    contributionData: ContributeTipData
  ): Promise<TipGoalContribution> {
    // First check if the goal exists and is active
    const { data: goal, error: goalError } = await supabase
      .from('tip_goals')
      .select('*')
      .eq('id', contributionData.goalId)
      .eq('is_active', true)
      .single();

    if (goalError || !goal) {
      throw new Error('Tip goal not found or inactive');
    }

    // Check if goal has ended
    if (goal.ends_at && new Date(goal.ends_at) < new Date()) {
      throw new Error('This tip goal has ended');
    }

    // Check if goal is already completed
    if (goal.current_amount_cents >= goal.target_amount_cents) {
      throw new Error('This tip goal has already been completed');
    }

    // Create the contribution
    const { data: contribution, error } = await supabase
      .from('tip_goal_contributions')
      .insert({
        goal_id: contributionData.goalId,
        user_id: userId,
        amount_cents: contributionData.amountCents,
        message: contributionData.message,
        is_anonymous: contributionData.isAnonymous || false,
        payment_intent_id: contributionData.paymentIntentId,
        payment_status: contributionData.paymentIntentId ? 'pending' : 'completed',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create contribution: ${error.message}`);
    }

    return contribution;
  }

  /**
   * Update tip goal
   */
  async updateGoal(goalId: string, updates: Partial<CreateTipGoalData>): Promise<TipGoal> {
    const { data: goal, error } = await supabase
      .from('tip_goals')
      .update({
        ...(updates.title && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.targetAmountCents && { target_amount_cents: updates.targetAmountCents }),
        ...(updates.emoji !== undefined && { emoji: updates.emoji }),
        ...(updates.colorHex && { color_hex: updates.colorHex }),
        ...(updates.imageUrl !== undefined && { image_url: updates.imageUrl }),
        ...(updates.startsAt !== undefined && { starts_at: updates.startsAt }),
        ...(updates.endsAt !== undefined && { ends_at: updates.endsAt }),
        ...(updates.isPublic !== undefined && { is_public: updates.isPublic }),
        ...(updates.showProgress !== undefined && { show_progress: updates.showProgress }),
        ...(updates.celebrationMessage !== undefined && { celebration_message: updates.celebrationMessage }),
        ...(updates.metadata && { metadata: updates.metadata }),
      })
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update goal: ${error.message}`);
    }

    return goal;
  }

  /**
   * Deactivate tip goal
   */
  async deactivateGoal(goalId: string): Promise<void> {
    const { error } = await supabase
      .from('tip_goals')
      .update({ is_active: false })
      .eq('id', goalId);

    if (error) {
      throw new Error(`Failed to deactivate goal: ${error.message}`);
    }
  }

  /**
   * Get tip goal statistics for a creator
   */
  async getCreatorStats(creatorId: string): Promise<TipGoalStats> {
    // Get all goals
    const { data: goals } = await supabase
      .from('tip_goals')
      .select('*')
      .eq('creator_id', creatorId);

    // Get all contributions
    const { data: contributions } = await supabase
      .from('tip_goal_contributions')
      .select('amount_cents, goal_id, user_id')
      .eq('payment_status', 'completed')
      .in('goal_id', (goals || []).map(g => g.id));

    const activeGoals = (goals || []).filter(g => g.is_active).length;
    const completedGoals = (goals || []).filter(g => g.current_amount_cents >= g.target_amount_cents).length;
    const totalRaised = (contributions || []).reduce((sum, c) => sum + c.amount_cents, 0);
    const uniqueContributors = new Set((contributions || []).map(c => c.user_id)).size;
    const averageContribution = contributions && contributions.length > 0 
      ? totalRaised / contributions.length 
      : 0;

    // Top goals by progress
    const topGoals = (goals || [])
      .map(goal => ({
        goal,
        progressPercent: goal.target_amount_cents > 0 
          ? Math.min((goal.current_amount_cents / goal.target_amount_cents) * 100, 100)
          : 0,
        contributorCount: (contributions || []).filter(c => c.goal_id === goal.id).length
      }))
      .sort((a, b) => b.progressPercent - a.progressPercent)
      .slice(0, 5);

    return {
      totalGoals: (goals || []).length,
      activeGoals,
      completedGoals,
      totalRaised,
      totalContributors: uniqueContributors,
      averageContribution,
      topGoals,
    };
  }

  /**
   * Create default milestones for a goal
   */
  private async createDefaultMilestones(goalId: string, targetAmountCents: number): Promise<void> {
    const defaultMilestones = [
      { percentage: 25, title: 'First Quarter!', message: '25% of the way there! 🎉' },
      { percentage: 50, title: 'Halfway There!', message: 'Halfway to the goal! Keep it up! 🚀' },
      { percentage: 75, title: 'Almost There!', message: '75% complete! So close now! 💪' },
      { percentage: 100, title: 'Goal Completed!', message: '🎊 Amazing! Goal completed! Thank you everyone! 🎊' },
    ];

    const milestones = defaultMilestones.map(milestone => ({
      goal_id: goalId,
      percentage: milestone.percentage,
      amount_cents: Math.round((targetAmountCents * milestone.percentage) / 100),
      title: milestone.title,
      message: milestone.message,
      celebration_type: milestone.percentage === 100 ? 'fireworks' : 'confetti',
    }));

    await supabase
      .from('tip_goal_milestones')
      .insert(milestones);
  }

  /**
   * Check and trigger milestone celebrations
   */
  async checkMilestones(goalId: string): Promise<TipGoalMilestone[]> {
    const { data: goal } = await supabase
      .from('tip_goals')
      .select('current_amount_cents, target_amount_cents')
      .eq('id', goalId)
      .single();

    if (!goal) return [];

    const progressPercent = goal.target_amount_cents > 0 
      ? (goal.current_amount_cents / goal.target_amount_cents) * 100
      : 0;

    // Get milestones that should be marked as reached
    const { data: milestones } = await supabase
      .from('tip_goal_milestones')
      .select('*')
      .eq('goal_id', goalId)
      .lte('percentage', progressPercent)
      .eq('is_reached', false);

    if (!milestones || milestones.length === 0) return [];

    // Mark milestones as reached
    const milestoneIds = milestones.map(m => m.id);
    await supabase
      .from('tip_goal_milestones')
      .update({ 
        is_reached: true, 
        reached_at: new Date().toISOString() 
      })
      .in('id', milestoneIds);

    return milestones;
  }

  /**
   * Get recent activity for tip goals
   */
  async getRecentActivity(creatorId: string, limit = 10): Promise<Array<{
    type: 'contribution' | 'milestone' | 'goal_completed';
    data: any;
    timestamp: string;
  }>> {
    // Get recent contributions
    const { data: contributions } = await supabase
      .from('tip_goal_contributions')
      .select(`
        *,
        tip_goals!inner(creator_id, title)
      `)
      .eq('tip_goals.creator_id', creatorId)
      .eq('payment_status', 'completed')
      .order('contributed_at', { ascending: false })
      .limit(limit);

    const activity = (contributions || []).map(contrib => ({
      type: 'contribution' as const,
      data: contrib,
      timestamp: contrib.contributed_at,
    }));

    // TODO: Add milestone and goal completion activities

    return activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Format currency amount
   */
  formatAmount(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  /**
   * Calculate time remaining for a goal
   */
  getTimeRemaining(endsAt: string | null): {
    days: number;
    hours: number;
    minutes: number;
    isExpired: boolean;
  } {
    if (!endsAt) {
      return { days: Infinity, hours: Infinity, minutes: Infinity, isExpired: false };
    }

    const end = new Date(endsAt).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, isExpired: false };
  }
}

export const tipGoalsService = new TipGoalsService();