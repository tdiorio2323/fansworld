// 🗳️ POLLS & FAN VOTING - TYPE DEFINITIONS

export interface Poll {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  question: string;
  
  // Poll options
  options: PollOption[];
  allowMultipleChoices: boolean;
  allowCustomOptions: boolean; // Users can add their own options
  maxCustomOptions?: number;
  
  // Visibility and access
  isPublic: boolean;
  requiresSubscription?: boolean;
  isPremium?: boolean; // Requires payment to vote
  votingFee?: number; // in cents
  
  // Timing
  startsAt?: string;
  endsAt?: string;
  timezone: string;
  
  // Settings
  showResults: 'always' | 'after_voting' | 'after_end' | 'never';
  allowResultsSharing: boolean;
  isAnonymous: boolean; // Hide voter identities
  
  // Stats
  totalVotes: number;
  uniqueVoters: number;
  
  // Engagement
  viewCount: number;
  shareCount: number;
  commentCount: number;
  
  // Status
  status: 'draft' | 'active' | 'ended' | 'cancelled';
  
  createdAt: string;
  updatedAt: string;
  
  // Metadata
  tags: string[];
  category?: 'general' | 'content' | 'fashion' | 'lifestyle' | 'nsfw' | 'business';
  thumbnailUrl?: string;
  
  // Relations
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  votes?: PollVote[];
  comments?: PollComment[];
}

export interface PollOption {
  id: string;
  text: string;
  imageUrl?: string;
  description?: string;
  voteCount: number;
  percentage: number;
  order: number;
  isCustom: boolean; // Added by a user vs creator
  addedBy?: string; // User ID who added custom option
}

export interface PollVote {
  id: string;
  pollId: string;
  voterId: string;
  optionIds: string[]; // Can vote for multiple options
  amount?: number; // If premium voting
  paymentStatus?: 'pending' | 'completed' | 'failed';
  isAnonymous: boolean;
  createdAt: string;
  
  // Relations
  voter?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  options?: PollOption[];
}

export interface PollComment {
  id: string;
  pollId: string;
  userId: string;
  content: string;
  createdAt: string;
  
  user?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface FanVotingCampaign {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  type: 'outfit_choice' | 'content_type' | 'photo_contest' | 'general_decision' | 'collaboration_choice';
  
  // Voting items (what fans are voting on)
  items: VotingItem[];
  
  // Settings
  votingType: 'single_choice' | 'multiple_choice' | 'ranked_choice' | 'rating';
  maxChoices?: number; // For multiple choice
  allowTies: boolean;
  
  // Premium features
  isPremium: boolean;
  votingPrice: number; // Price per vote in cents
  hasVotingPower: boolean; // Higher-tier subscribers get more voting power
  
  // Timing
  startsAt: string;
  endsAt: string;
  timezone: string;
  
  // Rewards
  hasRewards: boolean;
  rewards: CampaignReward[];
  
  // Stats
  totalVotes: number;
  totalRevenue: number; // From premium voting
  participantCount: number;
  
  status: 'draft' | 'active' | 'ended' | 'cancelled';
  
  createdAt: string;
  updatedAt: string;
  
  // Relations
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  votes?: CampaignVote[];
}

export interface VotingItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  voteCount: number;
  totalRating?: number; // For rating-based voting
  averageRating?: number;
  order: number;
}

export interface CampaignVote {
  id: string;
  campaignId: string;
  voterId: string;
  itemId: string;
  
  // Vote details
  choice?: string; // For single/multiple choice
  ranking?: number; // For ranked choice (1 = first choice)
  rating?: number; // For rating-based (1-5 or 1-10)
  votingPower: number; // Based on subscription tier
  
  // Premium
  amount?: number; // Amount paid for vote
  paymentStatus?: 'pending' | 'completed' | 'failed';
  
  createdAt: string;
  
  voter?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface CampaignReward {
  id: string;
  title: string;
  description: string;
  type: 'content_access' | 'discount' | 'custom_message' | 'video_call' | 'physical_item';
  value?: number; // Discount amount or item value
  quantity?: number; // Limited quantity rewards
  claimedCount: number;
  
  // Eligibility
  minVotes?: number; // Minimum votes to be eligible
  winnerOnly?: boolean; // Only for winning choice voters
  randomSelection?: boolean; // Random selection from eligible voters
}

export interface PollCreateRequest {
  title: string;
  description?: string;
  question: string;
  options: Omit<PollOption, 'id' | 'voteCount' | 'percentage' | 'isCustom' | 'addedBy'>[];
  allowMultipleChoices: boolean;
  allowCustomOptions: boolean;
  maxCustomOptions?: number;
  isPublic: boolean;
  requiresSubscription?: boolean;
  isPremium?: boolean;
  votingFee?: number;
  startsAt?: string;
  endsAt?: string;
  timezone: string;
  showResults: Poll['showResults'];
  allowResultsSharing: boolean;
  isAnonymous: boolean;
  tags: string[];
  category?: Poll['category'];
  thumbnailUrl?: string;
}

export interface PollUpdateRequest {
  title?: string;
  description?: string;
  endsAt?: string; // Can extend but not shorten active polls
  showResults?: Poll['showResults'];
  allowResultsSharing?: boolean;
  tags?: string[];
  status?: 'active' | 'ended' | 'cancelled';
}

export interface CampaignCreateRequest {
  title: string;
  description: string;
  type: FanVotingCampaign['type'];
  items: Omit<VotingItem, 'id' | 'voteCount' | 'totalRating' | 'averageRating'>[];
  votingType: FanVotingCampaign['votingType'];
  maxChoices?: number;
  allowTies: boolean;
  isPremium: boolean;
  votingPrice: number;
  hasVotingPower: boolean;
  startsAt: string;
  endsAt: string;
  timezone: string;
  hasRewards: boolean;
  rewards: Omit<CampaignReward, 'id' | 'claimedCount'>[];
}

export interface PollFilter {
  creatorId?: string;
  status?: Poll['status'];
  category?: Poll['category'];
  isPublic?: boolean;
  isPremium?: boolean;
  tags?: string[];
  hasEnded?: boolean;
  sortBy?: 'newest' | 'oldest' | 'most_votes' | 'most_viewed' | 'ending_soon';
  limit?: number;
  offset?: number;
}

export interface PollStats {
  totalPolls: number;
  totalVotes: number;
  totalRevenue: number; // From premium polls
  averageVotesPerPoll: number;
  participationRate: number; // Votes / Views
  premiumConversionRate: number; // Premium votes / total votes
  
  // Performance metrics
  topPerformingPolls: Poll[];
  mostEngagedVoters: Array<{
    userId: string;
    username: string;
    voteCount: number;
    totalSpent: number;
  }>;
  
  // Analytics
  votesByCategory: Record<string, number>;
  votesByDay: Array<{
    date: string;
    votes: number;
    revenue: number;
  }>;
  votesByHour: Array<{
    hour: number;
    votes: number;
  }>;
}

export interface VotingAnalytics {
  pollId: string;
  views: number;
  uniqueViews: number;
  votes: number;
  uniqueVoters: number;
  comments: number;
  shares: number;
  revenue?: number; // For premium polls
  participationRate: number;
  completionTime: number; // Average time to vote in seconds
  
  // Demographic insights
  voterDemographics: {
    bySubscriptionTier: Record<string, number>;
    byLocation: Record<string, number>;
    byAge: Record<string, number>;
  };
  
  // Engagement patterns
  votingPattern: Array<{
    timeSlot: string;
    votes: number;
    newVoters: number;
  }>;
  
  // Option performance
  optionAnalytics: Array<{
    optionId: string;
    optionText: string;
    votes: number;
    percentage: number;
    conversionRate: number; // Views to votes for this option
  }>;
}

// Real-time events
export interface PollVoteEvent {
  type: 'POLL_VOTED';
  poll: Poll;
  vote: PollVote;
  timestamp: string;
}

export interface PollEndedEvent {
  type: 'POLL_ENDED';
  poll: Poll;
  results: PollOption[];
  timestamp: string;
}

export interface NewPollOptionEvent {
  type: 'POLL_OPTION_ADDED';
  poll: Poll;
  option: PollOption;
  addedBy: {
    id: string;
    username: string;
  };
  timestamp: string;
}

// Templates and suggestions
export interface PollTemplate {
  id: string;
  name: string;
  description: string;
  category: Poll['category'];
  question: string;
  options: string[];
  settings: {
    allowMultipleChoices: boolean;
    showResults: Poll['showResults'];
    isAnonymous: boolean;
  };
  isPopular: boolean;
}

export interface PollConfig {
  enabled: boolean;
  maxOptions: number;
  maxCustomOptions: number;
  allowPremiumPolls: boolean;
  maxVotingFee: number; // in cents
  defaultDuration: number; // hours
  maxDuration: number; // hours
  minDuration: number; // minutes
  features: {
    customOptions: boolean;
    premiumVoting: boolean;
    anonymousVoting: boolean;
    scheduledPolls: boolean;
    pollComments: boolean;
    resultSharing: boolean;
    votingPower: boolean; // Subscription-based voting power
  };
  votingPowerMultipliers: {
    free: number;
    basic: number;
    premium: number;
    vip: number;
  };
}