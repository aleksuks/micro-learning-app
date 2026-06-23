import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { updateInterestScore, EngagementSignal } from '@/lib/recommendation';

export function useProgress(userId: string | undefined) {
  const recordWatch = useCallback(
    async (contentItemId: string, watchPercent: number, topicId: string) => {
      if (!userId) return;

      const watched = watchPercent >= 90;
      const completed_at = watched ? new Date().toISOString() : null;

      await supabase.from('user_progress').upsert(
        {
          user_id: userId,
          content_item_id: contentItemId,
          watched,
          watch_percent: watchPercent,
          time_spent_seconds: 0,
          viewed_at: new Date().toISOString(),
          ...(completed_at ? { completed_at } : {}),
        },
        { onConflict: 'user_id,content_item_id' }
      );

      let signal: EngagementSignal = 'skipped';
      if (watchPercent >= 80) signal = 'watched_80';
      else if (watchPercent >= 40) signal = 'watched_40';
      else if (watchPercent > 5) signal = 'watched_low';

      updateInterestScore(userId, topicId, signal).catch(() => {});
    },
    [userId]
  );

  const recordQuizAnswer = useCallback(
    async (contentItemId: string, correct: boolean, topicId: string) => {
      if (!userId) return;

      await supabase.from('user_progress').upsert(
        {
          user_id: userId,
          content_item_id: contentItemId,
          quiz_answered: true,
          quiz_answered_correctly: correct,
        },
        { onConflict: 'user_id,content_item_id' }
      );

      if (correct) {
        updateInterestScore(userId, topicId, 'quiz_correct').catch(() => {});
      }
    },
    [userId]
  );

  return { recordWatch, recordQuizAnswer };
}
