import { supabase } from '@/lib/supabase';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function checkAndUpdateStreak(userId: string): Promise<void> {
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!streak) return;

  const now = new Date();
  const lastActivity = streak.last_activity_at ? new Date(streak.last_activity_at) : null;

  if (!lastActivity) {
    await supabase
      .from('user_streaks')
      .update({
        current_streak: 1,
        longest_streak: Math.max(1, streak.longest_streak),
        last_activity_at: now.toISOString(),
        streak_started_at: now.toISOString(),
      })
      .eq('user_id', userId);
    return;
  }

  const daysSinceLast = Math.floor((now.getTime() - lastActivity.getTime()) / DAY_MS);

  if (daysSinceLast === 0) {
    // Already active today — no change
    return;
  }

  if (daysSinceLast === 1) {
    const newStreak = streak.current_streak + 1;
    await supabase
      .from('user_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streak.longest_streak),
        last_activity_at: now.toISOString(),
      })
      .eq('user_id', userId);
    return;
  }

  // Streak broken
  await supabase
    .from('user_streaks')
    .update({
      current_streak: 1,
      last_activity_at: now.toISOString(),
      streak_started_at: now.toISOString(),
    })
    .eq('user_id', userId);
}
