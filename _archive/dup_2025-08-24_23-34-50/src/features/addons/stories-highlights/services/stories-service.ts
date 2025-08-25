// 📚 STORIES & HIGHLIGHTS - SERVICE LAYER

import { supabase } from '@/integrations/supabase/client';
import { 
  Story, 
  Highlight, 
  StoryCreateRequest, 
  StoryUpdateRequest,
  HighlightCreateRequest,
  HighlightUpdateRequest,
  StoryFilter,
  StoryStats,
  StoryAnalytics,
  StoryView,
  StoryLike,
  StoryComment 
} from '../types';

export class StoriesService {
  // Story CRUD operations
  static async createStory(data: StoryCreateRequest): Promise<Story> {
    const { data: result, error } = await supabase
      .from('stories')
      .insert({
        ...data,
        creator_id: (await supabase.auth.getUser()).data.user?.id,
        expires_at: data.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        premium_price: data.premiumPrice || null,
      })
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url, is_verified)
      `)
      .single();

    if (error) throw error;
    return this.mapStoryFromDB(result);
  }

  static async getStory(id: string): Promise<Story | null> {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url, is_verified),
        views:story_views(id, viewer_id, viewed_at, completed_percentage, interacted),
        likes:story_likes(id, user_id, created_at),
        comments:story_comments(id, user_id, content, created_at)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapStoryFromDB(data);
  }

  static async getStories(filter: StoryFilter = {}): Promise<Story[]> {
    let query = supabase
      .from('stories')
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url, is_verified)
      `);

    // Apply filters
    if (filter.creatorId) {
      query = query.eq('creator_id', filter.creatorId);
    }

    if (filter.isPublic !== undefined) {
      query = query.eq('is_public', filter.isPublic);
    }

    if (filter.isPremium !== undefined) {
      query = query.eq('is_premium', filter.isPremium);
    }

    if (filter.tags && filter.tags.length > 0) {
      query = query.contains('tags', filter.tags);
    }

    if (filter.mood) {
      query = query.eq('mood', filter.mood);
    }

    if (filter.hasHighlight !== undefined) {
      if (filter.hasHighlight) {
        query = query.not('highlight_id', 'is', null);
      } else {
        query = query.is('highlight_id', null);
      }
    }

    // Apply sorting
    switch (filter.sortBy) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'popular':
        query = query.order('view_count', { ascending: false });
        break;
      case 'most_viewed':
        query = query.order('view_count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (filter.limit) {
      query = query.limit(filter.limit);
    }
    if (filter.offset) {
      query = query.range(filter.offset, filter.offset + (filter.limit || 20) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map(this.mapStoryFromDB);
  }

  static async updateStory(id: string, data: StoryUpdateRequest): Promise<Story> {
    const { data: result, error } = await supabase
      .from('stories')
      .update({
        ...data,
        highlight_id: data.highlightId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url, is_verified)
      `)
      .single();

    if (error) throw error;
    return this.mapStoryFromDB(result);
  }

  static async deleteStory(id: string): Promise<void> {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Story interactions
  static async viewStory(storyId: string, completedPercentage: number = 100): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    // Record view
    await supabase
      .from('story_views')
      .upsert({
        story_id: storyId,
        viewer_id: user.id,
        completed_percentage: completedPercentage,
        viewed_at: new Date().toISOString(),
      });

    // Update view count
    await supabase.rpc('increment_story_views', { story_id: storyId });
  }

  static async likeStory(storyId: string): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('story_likes')
      .upsert({
        story_id: storyId,
        user_id: user.id,
      });

    if (error) throw error;

    // Update like count
    await supabase.rpc('increment_story_likes', { story_id: storyId });
  }

  static async unlikeStory(storyId: string): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('story_likes')
      .delete()
      .eq('story_id', storyId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Update like count
    await supabase.rpc('decrement_story_likes', { story_id: storyId });
  }

  static async commentOnStory(storyId: string, content: string): Promise<StoryComment> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('story_comments')
      .insert({
        story_id: storyId,
        user_id: user.id,
        content,
      })
      .select(`
        *,
        user:profiles(id, username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Update comment count
    await supabase.rpc('increment_story_comments', { story_id: storyId });

    return {
      id: data.id,
      storyId: data.story_id,
      userId: data.user_id,
      content: data.content,
      createdAt: data.created_at,
      user: data.user ? {
        id: data.user.id,
        username: data.user.username,
        displayName: data.user.display_name,
        avatarUrl: data.user.avatar_url,
      } : undefined,
    };
  }

  // Highlights CRUD operations
  static async createHighlight(data: HighlightCreateRequest): Promise<Highlight> {
    const { data: result, error } = await supabase
      .from('highlights')
      .insert({
        ...data,
        creator_id: (await supabase.auth.getUser()).data.user?.id,
        story_ids: data.storyIds || [],
        story_count: data.storyIds?.length || 0,
      })
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return this.mapHighlightFromDB(result);
  }

  static async getHighlight(id: string): Promise<Highlight | null> {
    const { data, error } = await supabase
      .from('highlights')
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url),
        stories:stories(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapHighlightFromDB(data);
  }

  static async getCreatorHighlights(creatorId: string): Promise<Highlight[]> {
    const { data, error } = await supabase
      .from('highlights')
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url)
      `)
      .eq('creator_id', creatorId)
      .order('order', { ascending: true });

    if (error) throw error;
    return data.map(this.mapHighlightFromDB);
  }

  static async updateHighlight(id: string, data: HighlightUpdateRequest): Promise<Highlight> {
    const updateData: any = { ...data };
    
    if (data.storyIds) {
      updateData.story_ids = data.storyIds;
      updateData.story_count = data.storyIds.length;
    }

    const { data: result, error } = await supabase
      .from('highlights')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return this.mapHighlightFromDB(result);
  }

  static async deleteHighlight(id: string): Promise<void> {
    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async addStoryToHighlight(highlightId: string, storyId: string): Promise<void> {
    // Get current highlight
    const highlight = await this.getHighlight(highlightId);
    if (!highlight) throw new Error('Highlight not found');

    // Add story to highlight
    const updatedStoryIds = [...highlight.storyIds, storyId];
    
    await this.updateHighlight(highlightId, {
      storyIds: updatedStoryIds,
    });

    // Update story to reference highlight
    await this.updateStory(storyId, {
      highlightId,
    });
  }

  static async removeStoryFromHighlight(highlightId: string, storyId: string): Promise<void> {
    // Get current highlight
    const highlight = await this.getHighlight(highlightId);
    if (!highlight) throw new Error('Highlight not found');

    // Remove story from highlight
    const updatedStoryIds = highlight.storyIds.filter(id => id !== storyId);
    
    await this.updateHighlight(highlightId, {
      storyIds: updatedStoryIds,
    });

    // Remove highlight reference from story
    await this.updateStory(storyId, {
      highlightId: undefined,
    });
  }

  // Analytics and stats
  static async getStoryStats(creatorId: string): Promise<StoryStats> {
    const { data: stats, error } = await supabase
      .from('story_stats_view')
      .select('*')
      .eq('creator_id', creatorId)
      .single();

    if (error) throw error;

    return {
      totalStories: stats.total_stories,
      totalViews: stats.total_views,
      totalLikes: stats.total_likes,
      totalComments: stats.total_comments,
      averageViewDuration: stats.average_view_duration,
      completionRate: stats.completion_rate,
      engagementRate: stats.engagement_rate,
      premiumRevenue: stats.premium_revenue,
      viewsByHour: stats.views_by_hour || [],
      topPerformingStories: [],
      audienceInsights: stats.audience_insights || {
        topViewers: [],
        demographics: { ageGroups: {}, locations: {} },
      },
    };
  }

  static async getStoryAnalytics(storyId: string): Promise<StoryAnalytics> {
    const { data: analytics, error } = await supabase
      .from('story_analytics_view')
      .select('*')
      .eq('story_id', storyId)
      .single();

    if (error) throw error;

    return {
      storyId: analytics.story_id,
      views: analytics.views,
      uniqueViews: analytics.unique_views,
      likes: analytics.likes,
      comments: analytics.comments,
      shares: analytics.shares,
      completionRate: analytics.completion_rate,
      averageWatchTime: analytics.average_watch_time,
      engagementRate: analytics.engagement_rate,
      revenue: analytics.revenue,
      viewerRetention: analytics.viewer_retention || [],
      interactionHeatmap: analytics.interaction_heatmap || [],
      audienceBreakdown: analytics.audience_breakdown || {
        subscribers: 0,
        nonSubscribers: 0,
        newViewers: 0,
        returningViewers: 0,
      },
    };
  }

  // Poll interactions
  static async voteOnPoll(storyId: string, contentIndex: number, option: string): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    await supabase
      .from('story_poll_votes')
      .upsert({
        story_id: storyId,
        content_index: contentIndex,
        voter_id: user.id,
        option,
      });
  }

  static async getPollResults(storyId: string, contentIndex: number): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('story_poll_votes')
      .select('option')
      .eq('story_id', storyId)
      .eq('content_index', contentIndex);

    if (error) throw error;

    const votes: Record<string, number> = {};
    data.forEach(vote => {
      votes[vote.option] = (votes[vote.option] || 0) + 1;
    });

    return votes;
  }

  // Helper methods
  private static mapStoryFromDB(data: any): Story {
    return {
      id: data.id,
      creatorId: data.creator_id,
      title: data.title,
      content: data.content,
      thumbnailUrl: data.thumbnail_url,
      highlightId: data.highlight_id,
      isPublic: data.is_public,
      requiresSubscription: data.requires_subscription,
      isPremium: data.is_premium,
      premiumPrice: data.premium_price,
      viewCount: data.view_count,
      likeCount: data.like_count,
      commentCount: data.comment_count,
      shareCount: data.share_count,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.tags || [],
      location: data.location,
      mood: data.mood,
      creator: data.creator ? {
        id: data.creator.id,
        username: data.creator.username,
        displayName: data.creator.display_name,
        avatarUrl: data.creator.avatar_url,
        isVerified: data.creator.is_verified,
      } : undefined,
      views: data.views?.map((view: any) => ({
        id: view.id,
        storyId: view.story_id,
        viewerId: view.viewer_id,
        viewedAt: view.viewed_at,
        completedPercentage: view.completed_percentage,
        interacted: view.interacted,
      })),
      likes: data.likes?.map((like: any) => ({
        id: like.id,
        storyId: like.story_id,
        userId: like.user_id,
        createdAt: like.created_at,
      })),
      comments: data.comments?.map((comment: any) => ({
        id: comment.id,
        storyId: comment.story_id,
        userId: comment.user_id,
        content: comment.content,
        createdAt: comment.created_at,
      })),
    };
  }

  private static mapHighlightFromDB(data: any): Highlight {
    return {
      id: data.id,
      creatorId: data.creator_id,
      title: data.title,
      description: data.description,
      coverUrl: data.cover_url,
      coverStoryId: data.cover_story_id,
      storyIds: data.story_ids || [],
      storyCount: data.story_count,
      isPublic: data.is_public,
      requiresSubscription: data.requires_subscription,
      order: data.order,
      viewCount: data.view_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      creator: data.creator ? {
        id: data.creator.id,
        username: data.creator.username,
        displayName: data.creator.display_name,
        avatarUrl: data.creator.avatar_url,
      } : undefined,
      stories: data.stories?.map(this.mapStoryFromDB),
    };
  }
}