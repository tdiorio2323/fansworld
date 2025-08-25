// 🎁 LOYALTY PROGRAM - MAIN EXPORTS

export { LoyaltyProgram as default } from './components/LoyaltyProgram';
export { LoyaltyService } from './services/loyalty-service';
export { DEFAULT_LOYALTY_CONFIG, REWARD_TEMPLATES, ACHIEVEMENT_TEMPLATES } from './config';
export type {
  LoyaltyProgram,
  LoyaltyMember,
  LoyaltyReward,
  LoyaltyTransaction,
  RewardRedemption,
  LoyaltyAnalytics,
  CreateLoyaltyProgramRequest,
  UpdateLoyaltyProgramRequest,
  JoinLoyaltyProgramRequest,
  EarnPointsRequest,
  RedeemRewardRequest,
} from './types';