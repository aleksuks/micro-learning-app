export type ComplexityLevel = 'beginner' | 'intermediate' | 'advanced';

export type ContentFormat = 'video' | 'text_card' | 'audio';

export interface Topic {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_name: string;
  color_primary: string;
  color_secondary: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SubTopic {
  id: string;
  topic_id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ContentItem {
  id: string;
  sub_topic_id: string;
  title: string;
  body_text: string | null;
  complexity_level: ComplexityLevel;
  format: ContentFormat;
  video_url: string | null;
  audio_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number;
  tags: string[];
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  content_item_id: string;
  prompt_text: string;
  choices: [string, string, string, string];
  correct_answer_index: 0 | 1 | 2 | 3;
  explanation: string | null;
  trigger_at_second: number | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserTopicInterest {
  id: string;
  user_id: string;
  topic_id: string;
  interest_score: number;
  explicit_score: number;
  implicit_score: number;
  last_updated: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  content_item_id: string;
  watched: boolean;
  watch_percent: number;
  quiz_answered: boolean;
  quiz_answered_correctly: boolean | null;
  time_spent_seconds: number;
  viewed_at: string;
  completed_at: string | null;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_at: string | null;
  streak_started_at: string | null;
  updated_at: string;
}

export interface EnrichedContentItem extends ContentItem {
  sub_topic: SubTopic & { topic: Topic };
  quiz_question: QuizQuestion | null;
}

export type FeedReason = 'interest' | 'exploration' | 'continuation';

export interface FeedItem {
  content_item: EnrichedContentItem;
  score: number;
  reason: FeedReason;
}

export interface RecommendationResult {
  feed: FeedItem[];
  fetchedAt: string;
}
