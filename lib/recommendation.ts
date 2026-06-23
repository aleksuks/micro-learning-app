import { supabase } from '@/lib/supabase';
import {
  ComplexityLevel,
  EnrichedContentItem,
  FeedItem,
  FeedReason,
  RecommendationResult,
  UserProgress,
  UserTopicInterest,
} from '@/types';

const COMPLEXITY_ORDER: ComplexityLevel[] = ['beginner', 'intermediate', 'advanced'];
const CANDIDATE_LIMIT = 200;
const DAY_MS = 24 * 60 * 60 * 1000;

// ============================================================
// Feed builder
// ============================================================

export async function buildFeed(
  userId: string,
  batchSize = 20
): Promise<RecommendationResult> {
  const [interestsRes, progressRes, candidatesRes] = await Promise.all([
    supabase
      .from('user_topic_interests')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(50),
    supabase
      .from('content_items')
      .select(`
        *,
        sub_topic:sub_topics (
          *,
          topic:topics (*)
        ),
        quiz_question:quiz_questions (*)
      `)
      .eq('is_published', true)
      .limit(CANDIDATE_LIMIT),
  ]);

  const interests: UserTopicInterest[] = interestsRes.data ?? [];
  const recentProgress: UserProgress[] = progressRes.data ?? [];
  const rawCandidates = candidatesRes.data ?? [];

  const seenIds = new Set(recentProgress.map(p => p.content_item_id));

  const candidates = rawCandidates.filter(
    (item): item is EnrichedContentItem => !seenIds.has(item.id)
  );

  const interestMap = new Map(interests.map(i => [i.topic_id, i]));
  const complexityMap = inferComplexityPerTopic(recentProgress, interests);
  const recentSubTopicIds = buildRecentSubTopicMap(recentProgress);

  const scored: Array<EnrichedContentItem & { score: number; reason: FeedReason }> =
    candidates.map(item => {
      const topicId = item.sub_topic?.topic?.id ?? '';
      const subTopicId = item.sub_topic_id;
      const topicInterest = interestMap.get(topicId)?.interest_score ?? 0.3;
      const recencyBonus = getRecencyBonus(subTopicId, recentSubTopicIds);
      const complexBonus = getComplexityBonus(
        item.complexity_level,
        complexityMap.get(topicId) ?? 'beginner'
      );
      const varietyPenalty = 0;

      const score =
        topicInterest * 0.5 +
        recencyBonus * 0.2 +
        complexBonus * 0.2 -
        varietyPenalty * 0.1;

      const reason: FeedReason =
        topicInterest < 0.3
          ? 'exploration'
          : recentSubTopicIds.has(subTopicId)
          ? 'continuation'
          : 'interest';

      return { ...item, score, reason };
    });

  scored.sort((a, b) => b.score - a.score);

  const explorationCount = Math.max(1, Math.floor(batchSize * 0.1));
  const explorationItems = selectExplorationItems(scored, interestMap, explorationCount);
  const explorationSet = new Set(explorationItems.map(e => e.id));

  const coreItems = scored
    .filter(item => !explorationSet.has(item.id))
    .slice(0, batchSize - explorationItems.length);

  const feed: FeedItem[] = interleaveExploration(coreItems, explorationItems).map(
    ({ score, reason, ...content_item }) => ({
      content_item: content_item as EnrichedContentItem,
      score,
      reason,
    })
  );

  return { feed, fetchedAt: new Date().toISOString() };
}

// ============================================================
// Interest score update (call after user watches content)
// ============================================================

export type EngagementSignal = 'quiz_correct' | 'watched_80' | 'watched_40' | 'watched_low' | 'skipped';

export async function updateInterestScore(
  userId: string,
  topicId: string,
  signal: EngagementSignal
): Promise<void> {
  const signalValue: Record<EngagementSignal, number> = {
    quiz_correct: 1.0,
    watched_80: 0.7,
    watched_40: 0.4,
    watched_low: 0.1,
    skipped: 0.0,
  };

  const { data: existing } = await supabase
    .from('user_topic_interests')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .single();

  const oldImplicit = existing?.implicit_score ?? 0;
  const explicitScore = existing?.explicit_score ?? 0;
  const newImplicit = oldImplicit * 0.8 + signalValue[signal] * 0.2;
  const newInterestScore = explicitScore * 0.4 + newImplicit * 0.6;

  await supabase.from('user_topic_interests').upsert(
    {
      user_id: userId,
      topic_id: topicId,
      interest_score: Math.min(1, Math.max(0, newInterestScore)),
      explicit_score: explicitScore,
      implicit_score: newImplicit,
      last_updated: new Date().toISOString(),
    },
    { onConflict: 'user_id,topic_id' }
  );
}

// ============================================================
// Helpers
// ============================================================

function inferComplexityPerTopic(
  progress: UserProgress[],
  interests: UserTopicInterest[]
): Map<string, ComplexityLevel> {
  const map = new Map<string, ComplexityLevel>();

  // Group quiz results by topic (we don't have topic_id on progress directly,
  // so this is a simplified heuristic: default everyone to beginner, bump up
  // if they have high quiz_correct rate overall)
  const correct = progress.filter(p => p.quiz_answered && p.quiz_answered_correctly).length;
  const answered = progress.filter(p => p.quiz_answered).length;
  const globalRate = answered > 5 ? correct / answered : 0;

  for (const interest of interests) {
    let level: ComplexityLevel = 'beginner';
    if (globalRate > 0.8) level = 'advanced';
    else if (globalRate > 0.5) level = 'intermediate';
    map.set(interest.topic_id, level);
  }

  return map;
}

function buildRecentSubTopicMap(progress: UserProgress[]): Set<string> {
  const now = Date.now();
  const recent = progress.filter(
    p => now - new Date(p.viewed_at).getTime() < 7 * DAY_MS
  );
  // We store sub_topic_id indirectly through content_item_id — this will be
  // enriched at the query layer. For now, track content_item_ids as a proxy.
  return new Set(recent.map(p => p.content_item_id));
}

function getRecencyBonus(subTopicId: string, recentIds: Set<string>): number {
  // Simplified: if the sub_topic_id was recently seen, give a bonus
  return recentIds.has(subTopicId) ? 0.15 : 0;
}

function getComplexityBonus(
  itemLevel: ComplexityLevel,
  targetLevel: ComplexityLevel
): number {
  const itemIdx = COMPLEXITY_ORDER.indexOf(itemLevel);
  const targetIdx = COMPLEXITY_ORDER.indexOf(targetLevel);
  const diff = Math.abs(itemIdx - targetIdx);
  if (diff === 0) return 0.2;
  if (diff === 1) return 0.1;
  return 0;
}

function selectExplorationItems<T extends { sub_topic?: { topic?: { id?: string } }; complexity_level: ComplexityLevel; id: string }>(
  scored: T[],
  interestMap: Map<string, UserTopicInterest>,
  count: number
): T[] {
  const lowInterest = scored.filter(item => {
    const topicId = item.sub_topic?.topic?.id ?? '';
    const score = interestMap.get(topicId)?.interest_score ?? 0;
    return score < 0.3 && item.complexity_level === 'beginner';
  });

  // Shuffle and take
  for (let i = lowInterest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lowInterest[i], lowInterest[j]] = [lowInterest[j], lowInterest[i]];
  }

  return lowInterest.slice(0, count);
}

function interleaveExploration<T extends { id: string }>(core: T[], exploration: T[]): T[] {
  const result: T[] = [...core];
  exploration.forEach((item, i) => {
    const position = Math.min((i + 1) * 5, result.length);
    result.splice(position, 0, item);
  });
  return result;
}
