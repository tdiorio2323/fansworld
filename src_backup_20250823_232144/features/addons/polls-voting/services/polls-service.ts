// 🗳️ POLLS & FAN VOTING - SERVICE LAYER

import { supabase } from '@/integrations/supabase/client';
import { 
  Poll, 
  PollCreateRequest, 
  PollUpdateRequest, 
  PollFilter,
  PollStats,
  VotingAnalytics,
  PollVote,
  PollComment,
  PollOption,
  FanVotingCampaign,
  CampaignCreateRequest,
  CampaignVote 
} from '../types';
import { calculateVotingPower, calculatePollResults } from '../config';

export class PollsService {
  // Poll CRUD operations
  static async createPoll(data: PollCreateRequest): Promise<Poll> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const { data: result, error } = await supabase
      .from('polls')
      .insert({
        creator_id: user.id,
        title: data.title,
        description: data.description,
        question: data.question,
        options: data.options.map((opt, index) => ({
          ...opt,
          id: crypto.randomUUID(),
          voteCount: 0,
          percentage: 0,
          order: index,
          isCustom: false,
        })),
        allow_multiple_choices: data.allowMultipleChoices,
        allow_custom_options: data.allowCustomOptions,
        max_custom_options: data.maxCustomOptions,
        is_public: data.isPublic,
        requires_subscription: data.requiresSubscription,
        is_premium: data.isPremium,
        voting_fee: data.votingFee,
        starts_at: data.startsAt,
        ends_at: data.endsAt,
        timezone: data.timezone,
        show_results: data.showResults,
        allow_results_sharing: data.allowResultsSharing,
        is_anonymous: data.isAnonymous,
        tags: data.tags,
        category: data.category,
        thumbnail_url: data.thumbnailUrl,
        status: data.startsAt && new Date(data.startsAt) > new Date() ? 'draft' : 'active',
      })
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url, is_verified)
      `)
      .single();

    if (error) throw error;
    return this.mapPollFromDB(result);
  }

  static async getPoll(id: string): Promise<Poll | null> {
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url, is_verified),
        votes:poll_votes(*),
        comments:poll_comments(
          *,
          user:profiles(id, username, display_name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapPollFromDB(data);
  }

  static async getPolls(filter: PollFilter = {}): Promise<Poll[]> {
    let query = supabase
      .from('polls')
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url, is_verified)
      `);

    // Apply filters
    if (filter.creatorId) {
      query = query.eq('creator_id', filter.creatorId);
    }

    if (filter.status) {
      query = query.eq('status', filter.status);
    }

    if (filter.category) {
      query = query.eq('category', filter.category);
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

    if (filter.hasEnded !== undefined) {
      const now = new Date().toISOString();
      if (filter.hasEnded) {
        query = query.lt('ends_at', now);
      } else {
        query = query.or(`ends_at.is.null,ends_at.gt.${now}`);
      }
    }

    // Apply sorting
    switch (filter.sortBy) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'most_votes':
        query = query.order('total_votes', { ascending: false });
        break;
      case 'most_viewed':
        query = query.order('view_count', { ascending: false });
        break;
      case 'ending_soon':
        query = query.order('ends_at', { ascending: true, nullsLast: true });
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

    return data.map(this.mapPollFromDB);
  }

  static async updatePoll(id: string, data: PollUpdateRequest): Promise<Poll> {
    const { data: result, error } = await supabase
      .from('polls')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url, is_verified)
      `)
      .single();

    if (error) throw error;
    return this.mapPollFromDB(result);
  }

  static async deletePoll(id: string): Promise<void> {
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Poll interactions
  static async viewPoll(pollId: string): Promise<void> {
    await supabase.rpc('increment_poll_views', { poll_id: pollId });
  }

  static async votePoll(pollId: string, optionIds: string[], amount?: number): Promise<PollVote> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    // Get user's subscription tier for voting power
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const votingPower = calculateVotingPower(profile?.subscription_tier || 'free');

    // Check if poll allows multiple choices
    const { data: poll } = await supabase
      .from('polls')
      .select('allow_multiple_choices, is_premium, voting_fee')
      .eq('id', pollId)
      .single();

    if (!poll) throw new Error('Poll not found');

    if (!poll.allow_multiple_choices && optionIds.length > 1) {
      throw new Error('This poll only allows single choice voting');
    }

    // Handle premium voting
    let paymentStatus = 'completed';
    if (poll.is_premium && poll.voting_fee) {
      // Process payment logic here
      // This would integrate with your payment system
      paymentStatus = 'pending';
    }

    // Create or update vote
    const { data: vote, error } = await supabase
      .from('poll_votes')
      .upsert({
        poll_id: pollId,
        voter_id: user.id,
        option_ids: optionIds,
        voting_power: votingPower,
        amount: amount || poll.voting_fee,
        payment_status: paymentStatus,
        is_anonymous: poll.is_anonymous || false,
      })
      .select(`
        *,
        voter:profiles(id, username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Update poll vote counts
    await this.updatePollCounts(pollId);

    return {
      id: vote.id,
      pollId: vote.poll_id,
      voterId: vote.voter_id,
      optionIds: vote.option_ids,
      amount: vote.amount,
      paymentStatus: vote.payment_status,
      isAnonymous: vote.is_anonymous,
      createdAt: vote.created_at,
      voter: vote.voter ? {
        id: vote.voter.id,
        username: vote.voter.username,
        displayName: vote.voter.display_name,
        avatarUrl: vote.voter.avatar_url,
      } : undefined,
    };
  }

  static async removeVote(pollId: string): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('poll_votes')
      .delete()
      .eq('poll_id', pollId)
      .eq('voter_id', user.id);

    if (error) throw error;

    // Update poll vote counts
    await this.updatePollCounts(pollId);
  }

  static async addCustomOption(pollId: string, text: string, imageUrl?: string): Promise<PollOption> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    // Get current poll
    const poll = await this.getPoll(pollId);
    if (!poll) throw new Error('Poll not found');

    if (!poll.allowCustomOptions) {
      throw new Error('Custom options are not allowed for this poll');
    }

    const customOptionsCount = poll.options.filter(opt => opt.isCustom).length;
    if (poll.maxCustomOptions && customOptionsCount >= poll.maxCustomOptions) {
      throw new Error('Maximum custom options reached');
    }

    // Create new option
    const newOption: PollOption = {
      id: crypto.randomUUID(),
      text,
      imageUrl,
      voteCount: 0,
      percentage: 0,
      order: poll.options.length,
      isCustom: true,
      addedBy: user.id,
    };

    // Update poll with new option
    const updatedOptions = [...poll.options, newOption];
    
    await supabase
      .from('polls')
      .update({ 
        options: updatedOptions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pollId);

    return newOption;
  }

  static async commentOnPoll(pollId: string, content: string): Promise<PollComment> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('poll_comments')
      .insert({
        poll_id: pollId,
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
    await supabase.rpc('increment_poll_comments', { poll_id: pollId });

    return {
      id: data.id,
      pollId: data.poll_id,
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

  // Fan Voting Campaigns
  static async createCampaign(data: CampaignCreateRequest): Promise<FanVotingCampaign> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const { data: result, error } = await supabase
      .from('voting_campaigns')
      .insert({
        creator_id: user.id,
        title: data.title,
        description: data.description,
        type: data.type,
        items: data.items.map((item, index) => ({
          ...item,
          id: crypto.randomUUID(),
          voteCount: 0,
          order: index,
        })),
        voting_type: data.votingType,
        max_choices: data.maxChoices,
        allow_ties: data.allowTies,
        is_premium: data.isPremium,
        voting_price: data.votingPrice,
        has_voting_power: data.hasVotingPower,
        starts_at: data.startsAt,
        ends_at: data.endsAt,
        timezone: data.timezone,
        has_rewards: data.hasRewards,
        rewards: data.hasRewards ? data.rewards.map(reward => ({
          ...reward,
          id: crypto.randomUUID(),
          claimedCount: 0,
        })) : [],
        status: new Date(data.startsAt) > new Date() ? 'draft' : 'active',
      })
      .select(`
        *,
        creator:profiles(id, username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return this.mapCampaignFromDB(result);
  }

  static async voteCampaign(
    campaignId: string, 
    itemId: string, 
    choice?: string, 
    ranking?: number, 
    rating?: number
  ): Promise<CampaignVote> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    // Get user's voting power
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const votingPower = calculateVotingPower(profile?.subscription_tier || 'free');

    const { data: vote, error } = await supabase
      .from('campaign_votes')
      .upsert({
        campaign_id: campaignId,
        voter_id: user.id,
        item_id: itemId,
        choice,
        ranking,
        rating,
        voting_power: votingPower,
      })
      .select(`
        *,
        voter:profiles(id, username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return {
      id: vote.id,
      campaignId: vote.campaign_id,
      voterId: vote.voter_id,
      itemId: vote.item_id,
      choice: vote.choice,
      ranking: vote.ranking,
      rating: vote.rating,
      votingPower: vote.voting_power,
      createdAt: vote.created_at,
      voter: vote.voter ? {
        id: vote.voter.id,
        username: vote.voter.username,
        displayName: vote.voter.display_name,
        avatarUrl: vote.voter.avatar_url,
      } : undefined,
    };
  }

  // Analytics and stats
  static async getPollStats(creatorId: string): Promise<PollStats> {
    const { data: stats, error } = await supabase
      .from('poll_stats_view')
      .select('*')
      .eq('creator_id', creatorId)
      .single();

    if (error) throw error;

    return {
      totalPolls: stats.total_polls,
      totalVotes: stats.total_votes,
      totalRevenue: stats.total_revenue,
      averageVotesPerPoll: stats.average_votes_per_poll,
      participationRate: stats.participation_rate,
      premiumConversionRate: stats.premium_conversion_rate,
      topPerformingPolls: [],
      mostEngagedVoters: stats.most_engaged_voters || [],
      votesByCategory: stats.votes_by_category || {},
      votesByDay: stats.votes_by_day || [],
      votesByHour: stats.votes_by_hour || [],
    };
  }

  static async getPollAnalytics(pollId: string): Promise<VotingAnalytics> {
    const { data: analytics, error } = await supabase
      .from('poll_analytics_view')
      .select('*')
      .eq('poll_id', pollId)
      .single();

    if (error) throw error;

    return {
      pollId: analytics.poll_id,
      views: analytics.views,
      uniqueViews: analytics.unique_views,
      votes: analytics.votes,
      uniqueVoters: analytics.unique_voters,
      comments: analytics.comments,
      shares: analytics.shares,
      revenue: analytics.revenue,
      participationRate: analytics.participation_rate,
      completionTime: analytics.completion_time,
      voterDemographics: analytics.voter_demographics || {
        bySubscriptionTier: {},
        byLocation: {},
        byAge: {},
      },
      votingPattern: analytics.voting_pattern || [],
      optionAnalytics: analytics.option_analytics || [],
    };
  }

  // Helper methods
  private static async updatePollCounts(pollId: string): Promise<void> {
    // Get all votes for this poll
    const { data: votes } = await supabase
      .from('poll_votes')
      .select('option_ids, voting_power')
      .eq('poll_id', pollId);

    if (!votes) return;

    // Get current poll
    const { data: poll } = await supabase
      .from('polls')
      .select('options')
      .eq('id', pollId)
      .single();

    if (!poll) return;

    // Calculate new counts
    const updatedOptions = calculatePollResults(poll.options, votes);
    const totalVotes = votes.reduce((sum, vote) => sum + (vote.voting_power || 1), 0);
    const uniqueVoters = votes.length;

    // Update poll
    await supabase
      .from('polls')
      .update({
        options: updatedOptions,
        total_votes: totalVotes,
        unique_voters: uniqueVoters,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pollId);
  }

  private static mapPollFromDB(data: any): Poll {
    return {
      id: data.id,
      creatorId: data.creator_id,
      title: data.title,
      description: data.description,
      question: data.question,
      options: data.options || [],
      allowMultipleChoices: data.allow_multiple_choices,
      allowCustomOptions: data.allow_custom_options,
      maxCustomOptions: data.max_custom_options,
      isPublic: data.is_public,
      requiresSubscription: data.requires_subscription,
      isPremium: data.is_premium,
      votingFee: data.voting_fee,
      startsAt: data.starts_at,
      endsAt: data.ends_at,
      timezone: data.timezone,
      showResults: data.show_results,
      allowResultsSharing: data.allow_results_sharing,
      isAnonymous: data.is_anonymous,
      totalVotes: data.total_votes,
      uniqueVoters: data.unique_voters,
      viewCount: data.view_count,
      shareCount: data.share_count,
      commentCount: data.comment_count,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      tags: data.tags || [],
      category: data.category,
      thumbnailUrl: data.thumbnail_url,
      creator: data.creator ? {
        id: data.creator.id,
        username: data.creator.username,
        displayName: data.creator.display_name,
        avatarUrl: data.creator.avatar_url,
        isVerified: data.creator.is_verified,
      } : undefined,
      votes: data.votes?.map((vote: any) => ({
        id: vote.id,
        pollId: vote.poll_id,
        voterId: vote.voter_id,
        optionIds: vote.option_ids,
        amount: vote.amount,
        paymentStatus: vote.payment_status,
        isAnonymous: vote.is_anonymous,
        createdAt: vote.created_at,
      })),
      comments: data.comments?.map((comment: any) => ({
        id: comment.id,
        pollId: comment.poll_id,
        userId: comment.user_id,
        content: comment.content,
        createdAt: comment.created_at,
        user: comment.user ? {
          id: comment.user.id,
          username: comment.user.username,
          displayName: comment.user.display_name,
          avatarUrl: comment.user.avatar_url,
        } : undefined,
      })),
    };
  }

  private static mapCampaignFromDB(data: any): FanVotingCampaign {
    return {
      id: data.id,
      creatorId: data.creator_id,
      title: data.title,
      description: data.description,
      type: data.type,
      items: data.items || [],
      votingType: data.voting_type,
      maxChoices: data.max_choices,
      allowTies: data.allow_ties,
      isPremium: data.is_premium,
      votingPrice: data.voting_price,
      hasVotingPower: data.has_voting_power,
      startsAt: data.starts_at,
      endsAt: data.ends_at,
      timezone: data.timezone,
      hasRewards: data.has_rewards,
      rewards: data.rewards || [],
      totalVotes: data.total_votes,
      totalRevenue: data.total_revenue,
      participantCount: data.participant_count,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      creator: data.creator ? {
        id: data.creator.id,
        username: data.creator.username,
        displayName: data.creator.display_name,
        avatarUrl: data.creator.avatar_url,
      } : undefined,
    };
  }
}