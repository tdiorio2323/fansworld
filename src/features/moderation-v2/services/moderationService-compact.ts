/**
 * Moderation v2 Service - Compacted version
 * FansWorld Creator Platform
 */

import { supabase } from '@/integrations/supabase/client';
import { dbOps, dateUtils, asyncUtils, handleError } from '@/lib/compact-utils';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
export type ModerationRule = Tables['moderation_v2_rules']['Row'];
export type ModerationQueueItem = Tables['moderation_v2_queue']['Row'];
export type ModerationAction = Tables['moderation_v2_actions']['Row'];

type RuleData = {
  name: string;
  description?: string;
  ruleType: string;
  conditions: Record<string, unknown>;
  actions: Record<string, unknown>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  isAutoEnforce?: boolean;
  requiresHumanReview?: boolean;
  aiConfidenceThreshold?: number;
  metadata?: Record<string, unknown>;
};

type QueueData = {
  contentType: string;
  contentId: string;
  contentData?: Record<string, unknown>;
  reportedUserId?: string;
  reporterUserId?: string;
  triggeredRuleId?: string;
  priority?: number;
  aiAnalysis?: Record<string, unknown>;
  aiConfidence?: number;
  aiRecommendation?: string;
  metadata?: Record<string, unknown>;
};

type ReviewData = {
  decision: 'approved' | 'rejected' | 'escalated';
  notes?: string;
  actionsTaken?: Record<string, unknown>[];
};

type Stats = {
  totalRules: number;
  activeRules: number;
  totalQueueItems: number;
  pendingItems: number;
  reviewedToday: number;
  averageReviewTime: number;
  accuracyRate: number;
  topTriggerRules: { rule: ModerationRule; triggerCount: number }[];
  recentActivity: { type: string; timestamp: string; data: unknown }[];
};

class ModerationV2Service {
  private table = {
    rules: 'moderation_v2_rules',
    queue: 'moderation_v2_queue',
    actions: 'moderation_v2_actions'
  };

  // Compact rule creation
  async createRule(creatorId: string, data: RuleData): Promise<ModerationRule> {
    return dbOps.upsert<ModerationRule>(this.table.rules, {
      creator_id: creatorId,
      name: data.name,
      description: data.description,
      rule_type: data.ruleType,
      conditions: data.conditions,
      actions: data.actions,
      severity: data.severity || 'medium',
      is_auto_enforce: data.isAutoEnforce || false,
      requires_human_review: data.requiresHumanReview !== false,
      ai_confidence_threshold: data.aiConfidenceThreshold || 0.85,
      metadata: data.metadata || {},
    });
  }

  // Compact rule fetching
  async getCreatorRules(creatorId: string, includeInactive = false): Promise<ModerationRule[]> {
    const rules = await dbOps.fetch<ModerationRule>(this.table.rules, { creator_id: creatorId });
    return includeInactive ? rules : rules.filter(r => r.is_active);
  }

  // Compact queue item creation
  async addToQueue(creatorId: string, data: QueueData): Promise<ModerationQueueItem> {
    return dbOps.upsert<ModerationQueueItem>(this.table.queue, {
      creator_id: creatorId,
      content_type: data.contentType,
      content_id: data.contentId,
      content_data: data.contentData,
      reported_user_id: data.reportedUserId,
      reporter_user_id: data.reporterUserId,
      triggered_rule_id: data.triggeredRuleId,
      priority: data.priority || 0,
      ai_analysis: data.aiAnalysis,
      ai_confidence: data.aiConfidence,
      ai_recommendation: data.aiRecommendation,
      metadata: data.metadata || {},
    });
  }

  // Compact queue fetching with filters
  async getQueueItems(creatorId: string, status?: string): Promise<ModerationQueueItem[]> {
    const filters: Record<string, unknown> = { creator_id: creatorId };
    if (status) filters.status = status;
    return dbOps.fetch<ModerationQueueItem>(this.table.queue, filters);
  }

  // Compact review process
  async reviewQueueItem(id: string, reviewerId: string, data: ReviewData): Promise<ModerationQueueItem> {
    const status = data.decision === 'escalated' ? 'escalated' : 
                   data.decision === 'approved' ? 'approved' : 'rejected';

    const item = await dbOps.upsert<ModerationQueueItem>(this.table.queue, {
      status,
      reviewed_by: reviewerId,
      reviewed_at: dateUtils.now(),
      review_decision: data.decision,
      review_notes: data.notes,
      actions_taken: data.actionsTaken || [],
    }, `id=${id}`);

    if (data.decision === 'rejected' && data.actionsTaken) {
      await this.executeActions(id, data.actionsTaken, reviewerId);
    }

    return item;
  }

  // Compact action execution
  async executeActions(queueId: string, actions: Record<string, unknown>[], executor: string): Promise<ModerationAction[]> {
    return asyncUtils.sequential(actions, async (action: any) => 
      dbOps.upsert<ModerationAction>(this.table.actions, {
        queue_item_id: queueId,
        action_type: action.type,
        action_data: action,
        target_user_id: action.targetUserId,
        target_content_type: action.targetContentType,
        target_content_id: action.targetContentId,
        executed_by: 'human',
        executor_user_id: executor,
        duration_seconds: action.durationSeconds,
        expires_at: action.durationSeconds ? dateUtils.addSeconds(action.durationSeconds) : null,
      })
    );
  }

  // Compact stats calculation
  async getModerationStats(creatorId: string): Promise<Stats> {
    const [rules, queueItems] = await asyncUtils.parallel([
      this.getCreatorRules(creatorId, true),
      this.getQueueItems(creatorId)
    ]);

    const pending = queueItems.filter(i => i.status === 'pending');
    const today = dateUtils.today();
    const reviewedToday = queueItems.filter(i => i.reviewed_at && dateUtils.isAfter(i.reviewed_at, today));
    
    const reviewed = queueItems.filter(i => i.reviewed_at);
    const avgTime = reviewed.length ? reviewed.reduce((sum, item) => {
      const created = new Date(item.created_at).getTime();
      const reviewedAt = new Date(item.reviewed_at!).getTime();
      return sum + (reviewedAt - created);
    }, 0) / reviewed.length / 1000 : 0;

    // Top triggered rules
    const ruleCount = new Map<string, number>();
    queueItems.forEach(item => {
      if (item.triggered_rule_id) {
        ruleCount.set(item.triggered_rule_id, (ruleCount.get(item.triggered_rule_id) || 0) + 1);
      }
    });

    const topRules = [...ruleCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({
        rule: rules.find(r => r.id === id)!,
        triggerCount: count
      }))
      .filter(item => item.rule);

    return {
      totalRules: rules.length,
      activeRules: rules.filter(r => r.is_active).length,
      totalQueueItems: queueItems.length,
      pendingItems: pending.length,
      reviewedToday: reviewedToday.length,
      averageReviewTime: Math.round(avgTime),
      accuracyRate: this.calculateAccuracy(queueItems),
      topTriggerRules: topRules,
      recentActivity: await this.getRecentActivity(creatorId)
    };
  }

  // Helper methods
  private calculateAccuracy(items: ModerationQueueItem[]): number {
    const aiReviewed = items.filter(i => i.ai_confidence && i.review_decision);
    if (!aiReviewed.length) return 0;
    
    const correct = aiReviewed.filter(i => 
      (i.ai_recommendation === 'approve' && i.review_decision === 'approved') ||
      (i.ai_recommendation === 'reject' && i.review_decision === 'rejected')
    ).length;
    
    return Math.round((correct / aiReviewed.length) * 100);
  }

  private async getRecentActivity(creatorId: string): Promise<Stats['recentActivity']> {
    const { data } = await supabase
      .from(this.table.actions)
      .select('action_type, created_at, action_data')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false })
      .limit(10);

    return (data || []).map(item => ({
      type: item.action_type,
      timestamp: item.created_at,
      data: item.action_data
    }));
  }
}

export const moderationService = new ModerationV2Service();