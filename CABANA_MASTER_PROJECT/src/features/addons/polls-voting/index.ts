// 🗳️ POLLS & FAN VOTING - MAIN EXPORTS

export { Polls as default } from './components/Polls';
export { PollsService } from './services/polls-service';
export { DEFAULT_POLLS_CONFIG, POLL_TEMPLATES } from './config';
export type {
  Poll,
  PollOption,
  PollVote,
  CreatePollRequest,
  UpdatePollRequest,
  PollFilter,
  PollAnalytics,
} from './types';