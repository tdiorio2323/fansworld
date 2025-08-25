/**
 * Moderation v2 Service - Enhanced moderation with AI assistance
 * FansWorld Creator Platform
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type ModerationRule = Database['public']['Tables']['moderation_v2_rules']['Row'];
export type ModerationQueueItem = Database['public']['Tables']['moderation_v2_queue']['Row'];
export type ModerationAction = Database['public']['Tables']['moderation_v2_actions']['Row'];

export interface CreateModerationRuleData {
  name: string;
  description?: string;
  ruleType: string;
  conditions: Record<string, any>;
  actions: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  isAutoEnforce?: boolean;
  requiresHumanReview?: boolean;
  aiConfidenceThreshold?: number;
  metadata?: Record<string, any>;
}

export interface CreateQueueItemData {
  contentType: string;
  contentId: string;
  contentData?: Record<string, any>;
  reportedUserId?: string;
  reporterUserId?: string;
  triggeredRuleId?: string;
  priority?: number;
  aiAnalysis?: Record<string, any>;
  aiConfidence?: number;
  aiRecommendation?: string;
  metadata?: Record<string, any>;
}

export interface ReviewQueueItemData {
  decision: 'approved' | 'rejected' | 'escalated';
  notes?: string;
  actionsTaken?: Array<Record<string, any>>;
}

export interface ModerationStats {
  totalRules: number;
  activeRules: number;
  totalQueueItems: number;
  pendingItems: number;
  reviewedToday: number;
  averageReviewTime: number;
  accuracyRate: number;
  topTriggerRules: Array<{
    rule: ModerationRule;
    triggerCount: number;
  }>;
  recentActivity: Array<{
    type: string;
    timestamp: string;
    data: any;
  }>;
}

class ModerationV2Service {
  /**
   * Create a new moderation rule
   */
  async createRule(creatorId: string, data: CreateModerationRuleData): Promise<ModerationRule> {
    const { data: rule, error } = await supabase
      .from('moderation_v2_rules')
      .insert({
        creator_id: creatorId,
        name: data.name,
        description: data.description,
        rule_type: data.ruleType,
        conditions: data.conditions,
        actions: data.actions,
        severity: data.severity || 'medium',
        is_auto_enforce: data.isAutoEnforce || false,
        requires_human_review: data.requiresHumanReview !== false, // Default to true
        ai_confidence_threshold: data.aiConfidenceThreshold || 0.85,
        metadata: data.metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create moderation rule: ${error.message}`);
    }

    return rule;
  }

  /**
   * Get moderation rules for a creator
   */
  async getCreatorRules(creatorId: string, includeInactive = false): Promise<ModerationRule[]> {
    let query = supabase
      .from('moderation_v2_rules')
      .select('*')
      .eq('creator_id', creatorId);

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data: rules, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch moderation rules: ${error.message}`);
    }

    return rules || [];
  }

  /**
   * Add item to moderation queue
   */
  async addToQueue(creatorId: string, data: CreateQueueItemData): Promise<ModerationQueueItem> {
    // Check if there are any applicable rules
    const rules = await this.getCreatorRules(creatorId);
    const applicableRule = this.findApplicableRule(rules, data);

    const { data: queueItem, error } = await supabase
      .from('moderation_v2_queue')
      .insert({
        creator_id: creatorId,
        content_type: data.contentType,
        content_id: data.contentId,
        content_data: data.contentData,
        reported_user_id: data.reportedUserId,
        reporter_user_id: data.reporterUserId,
        triggered_rule_id: data.triggeredRuleId || applicableRule?.id,
        priority: data.priority || this.calculatePriority(applicableRule),
        ai_analysis: data.aiAnalysis,
        ai_confidence: data.aiConfidence,
        ai_recommendation: data.aiRecommendation,
        metadata: data.metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add item to moderation queue: ${error.message}`);
    }

    // Update rule trigger count if applicable
    if (applicableRule) {
      await supabase
        .from('moderation_v2_rules')
        .update({ trigger_count: applicableRule.trigger_count + 1 })
        .eq('id', applicableRule.id);
    }

    // Auto-execute if rule allows and confidence is high enough
    if (applicableRule && applicableRule.is_auto_enforce && 
        data.aiConfidence && data.aiConfidence >= applicableRule.ai_confidence_threshold) {
      await this.autoExecuteActions(queueItem, applicableRule);
    }

    return queueItem;
  }

  /**
   * Get moderation queue for a creator
   */
  async getCreatorQueue(
    creatorId: string, 
    status?: string, 
    limit = 50
  ): Promise<Array<ModerationQueueItem & { rule?: ModerationRule }>> {
    let query = supabase
      .from('moderation_v2_queue')
      .select(`
        *,
        moderation_v2_rules (*)
      `)
      .eq('creator_id', creatorId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: queueItems, error } = await query
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch moderation queue: ${error.message}`);
    }

    return (queueItems || []).map(item => ({
      ...item,
      rule: item.moderation_v2_rules as ModerationRule | undefined
    }));
  }

  /**
   * Review a queue item
   */
  async reviewQueueItem(
    queueItemId: string, 
    reviewerId: string, 
    reviewData: ReviewQueueItemData
  ): Promise<ModerationQueueItem> {
    const { data: queueItem, error } = await supabase
      .from('moderation_v2_queue')
      .update({
        status: reviewData.decision === 'escalated' ? 'escalated' : 
                reviewData.decision === 'approved' ? 'approved' : 'rejected',
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        review_decision: reviewData.decision,
        review_notes: reviewData.notes,
        actions_taken: reviewData.actionsTaken || [],
      })
      .eq('id', queueItemId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to review queue item: ${error.message}`);
    }

    // Execute actions if rejected
    if (reviewData.decision === 'rejected' && reviewData.actionsTaken) {
      await this.executeActions(queueItemId, reviewData.actionsTaken, reviewerId);
    }

    return queueItem;
  }

  /**
   * Execute moderation actions
   */
  async executeActions(
    queueItemId: string, 
    actions: Array<Record<string, any>>, 
    executorUserId: string
  ): Promise<ModerationAction[]> {
    const executedActions: ModerationAction[] = [];

    for (const actionData of actions) {
      const { data: action, error } = await supabase
        .from('moderation_v2_actions')
        .insert({
          queue_item_id: queueItemId,
          action_type: actionData.type,
          action_data: actionData,
          target_user_id: actionData.targetUserId,
          target_content_type: actionData.targetContentType,
          target_content_id: actionData.targetContentId,
          executed_by: 'human',
          executor_user_id: executorUserId,
          duration_seconds: actionData.durationSeconds,
          expires_at: actionData.durationSeconds ? 
            new Date(Date.now() + (actionData.durationSeconds * 1000)).toISOString() : 
            null,
        })
        .select()
        .single();

      if (!error && action) {
        executedActions.push(action);
      }
    }

    return executedActions;
  }

  /**
   * Get moderation statistics
   */
  async getModerationStats(creatorId: string): Promise<ModerationStats> {
    // Get rules
    const rules = await this.getCreatorRules(creatorId, true);
    const activeRules = rules.filter(r => r.is_active);

    // Get queue items
    const { data: queueItems } = await supabase
      .from('moderation_v2_queue')
      .select('*')
      .eq('creator_id', creatorId);

    const pendingItems = (queueItems || []).filter(item => item.status === 'pending');
    
    // Get items reviewed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reviewedToday = (queueItems || []).filter(
      item => item.reviewed_at && new Date(item.reviewed_at) >= today
    );

    // Calculate average review time
    const reviewedItems = (queueItems || []).filter(item => item.reviewed_at);
    const averageReviewTime = reviewedItems.length > 0 
      ? reviewedItems.reduce((sum, item) => {
          const created = new Date(item.created_at).getTime();
          const reviewed = new Date(item.reviewed_at!).getTime();
          return sum + (reviewed - created);
        }, 0) / reviewedItems.length / (1000 * 60) // Convert to minutes
      : 0;

    // Calculate accuracy rate (simplified - in production, this would be more complex)
    const accurateDecisions = reviewedItems.filter(item => 
      item.ai_recommendation === item.review_decision
    ).length;
    const accuracyRate = reviewedItems.length > 0 
      ? (accurateDecisions / reviewedItems.length) * 100 
      : 0;

    // Top trigger rules
    const topTriggerRules = rules
      .sort((a, b) => b.trigger_count - a.trigger_count)
      .slice(0, 5)
      .map(rule => ({
        rule,
        triggerCount: rule.trigger_count
      }));

    // Recent activity (simplified)
    const recentActivity = reviewedItems
      .slice(0, 10)
      .map(item => ({
        type: 'item_reviewed',
        timestamp: item.reviewed_at!,
        data: {
          contentType: item.content_type,
          decision: item.review_decision
        }
      }));

    return {
      totalRules: rules.length,
      activeRules: activeRules.length,
      totalQueueItems: (queueItems || []).length,
      pendingItems: pendingItems.length,
      reviewedToday: reviewedToday.length,
      averageReviewTime: Number(averageReviewTime.toFixed(1)),
      accuracyRate: Number(accuracyRate.toFixed(1)),
      topTriggerRules,
      recentActivity,
    };
  }

  /**
   * Update a moderation rule
   */
  async updateRule(ruleId: string, updates: Partial<CreateModerationRuleData>): Promise<ModerationRule> {
    const { data: rule, error } = await supabase
      .from('moderation_v2_rules')
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.conditions && { conditions: updates.conditions }),
        ...(updates.actions && { actions: updates.actions }),
        ...(updates.severity && { severity: updates.severity }),
        ...(updates.isAutoEnforce !== undefined && { is_auto_enforce: updates.isAutoEnforce }),
        ...(updates.requiresHumanReview !== undefined && { requires_human_review: updates.requiresHumanReview }),
        ...(updates.aiConfidenceThreshold !== undefined && { ai_confidence_threshold: updates.aiConfidenceThreshold }),
        ...(updates.metadata && { metadata: updates.metadata }),
      })
      .eq('id', ruleId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update moderation rule: ${error.message}`);
    }

    return rule;
  }

  /**
   * Deactivate a moderation rule
   */
  async deactivateRule(ruleId: string): Promise<void> {
    const { error } = await supabase
      .from('moderation_v2_rules')
      .update({ is_active: false })
      .eq('id', ruleId);

    if (error) {
      throw new Error(`Failed to deactivate moderation rule: ${error.message}`);
    }
  }

  /**
   * Analyze content with AI (mock implementation)
   */
  async analyzeContent(
    contentType: string, 
    content: any
  ): Promise<{
    analysis: Record<string, any>;
    confidence: number;
    recommendation: 'approved' | 'rejected' | 'escalated';
    flags: string[];
  }> {
    // Mock AI analysis - in production, integrate with actual AI service
    const mockAnalysis = {
      toxicity_score: Math.random(),
      spam_probability: Math.random(),
      sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
      language_confidence: 0.95,
      detected_language: 'en',
    };

    const flags: string[] = [];
    let recommendation: 'approved' | 'rejected' | 'escalated' = 'approved';
    
    if (mockAnalysis.toxicity_score > 0.8) {
      flags.push('high_toxicity');
      recommendation = 'rejected';
    } else if (mockAnalysis.toxicity_score > 0.6) {
      flags.push('moderate_toxicity');
      recommendation = 'escalated';
    }

    if (mockAnalysis.spam_probability > 0.7) {
      flags.push('likely_spam');
      recommendation = 'rejected';
    }

    const confidence = Math.random() * 0.3 + 0.7; // 0.7 to 1.0

    return {
      analysis: mockAnalysis,
      confidence,
      recommendation,
      flags,
    };
  }

  /**
   * Private helper methods
   */
  private findApplicableRule(rules: ModerationRule[], data: CreateQueueItemData): ModerationRule | null {
    // Simplified rule matching - in production, this would be more sophisticated
    for (const rule of rules) {
      if (!rule.is_active) continue;
      
      const conditions = rule.conditions as Record<string, any>;
      
      if (conditions.contentType && conditions.contentType === data.contentType) {
        return rule;
      }
      
      if (conditions.severity && data.aiAnalysis) {
        const analysis = data.aiAnalysis as Record<string, any>;
        if (analysis.toxicity_score > (conditions.toxicityThreshold || 0.5)) {
          return rule;
        }
      }
    }
    
    return null;
  }

  private calculatePriority(rule?: ModerationRule): number {
    if (!rule) return 5; // Default priority
    
    switch (rule.severity) {
      case 'critical': return 10;
      case 'high': return 8;
      case 'medium': return 5;
      case 'low': return 2;
      default: return 5;
    }
  }

  private async autoExecuteActions(queueItem: ModerationQueueItem, rule: ModerationRule): Promise<void> {
    const actions = rule.actions as Record<string, any>;
    
    if (actions.autoActions && Array.isArray(actions.autoActions)) {
      const { error } = await supabase
        .from('moderation_v2_queue')
        .update({
          status: 'approved', // Auto-executed items are marked as approved
          reviewed_at: new Date().toISOString(),
          review_decision: 'approved',
          review_notes: 'Auto-executed by AI moderation',
          actions_taken: actions.autoActions,
        })
        .eq('id', queueItem.id);

      if (!error) {
        // Execute the actions
        await this.executeActions(queueItem.id, actions.autoActions, 'system');
      }
    }
  }

  /**
   * Built-in rule templates
   */
  static getRuleTemplates(): Array<{
    name: string;
    description: string;
    ruleType: string;
    conditions: Record<string, any>;
    actions: Record<string, any>;
  }> {
    return [
      {
        name: 'High Toxicity Content',
        description: 'Automatically flag content with high toxicity scores',
        ruleType: 'content_filter',
        conditions: {
          contentType: ['message', 'post', 'comment'],
          toxicityThreshold: 0.8,
          aiConfidenceRequired: 0.9,
        },
        actions: {
          autoActions: [
            {
              type: 'content_remove',
              reason: 'High toxicity detected',
            },
            {
              type: 'warn_user',
              message: 'Your content was removed for violating community guidelines.',
            }
          ]
        }
      },
      {
        name: 'Spam Detection',
        description: 'Flag potential spam messages',
        ruleType: 'spam_filter',
        conditions: {
          spamProbabilityThreshold: 0.7,
          contentType: ['message'],
        },
        actions: {
          manualReview: true,
          autoActions: [
            {
              type: 'content_flag',
              reason: 'Potential spam detected',
            }
          ]
        }
      },
      {
        name: 'Excessive Messaging',
        description: 'Flag users sending too many messages in short periods',
        ruleType: 'user_behavior',
        conditions: {
          messageCountThreshold: 10,
          timeWindowMinutes: 5,
        },
        actions: {
          autoActions: [
            {
              type: 'temporary_mute',
              durationMinutes: 30,
              reason: 'Excessive messaging detected',
            }
          ]
        }
      }
    ];
  }
}

export const moderationV2Service = new ModerationV2Service();