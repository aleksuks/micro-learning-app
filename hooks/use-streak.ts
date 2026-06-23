import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { checkAndUpdateStreak } from '@/lib/streaks';
import { UserStreak } from '@/types';

export function useStreak(userId: string | undefined) {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStreak = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    await checkAndUpdateStreak(userId);

    const { data } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    setStreak(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return { streak, loading, refresh: fetchStreak };
}
