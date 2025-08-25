// 📚 STORIES & HIGHLIGHTS - MAIN EXPORTS

export { Stories as default } from './components/Stories';
export { StoriesService } from './services/stories-service';
export { DEFAULT_STORIES_CONFIG, STORY_TEMPLATES, STORY_FILTERS } from './config';
export type {
  Story,
  Highlight,
  StoryContent,
  StoryView,
  StoryLike,
  StoryComment,
  StoryCreateRequest,
  StoryUpdateRequest,
  HighlightCreateRequest,
  HighlightUpdateRequest,
  StoryFilter,
  StoryStats,
  StoryAnalytics,
  StoryTemplate,
  StoryConfig,
} from './types';