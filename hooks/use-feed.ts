import { useCallback, useEffect, useRef, useState } from 'react';
import { buildFeed } from '@/lib/recommendation';
import { FeedItem } from '@/types';

interface FeedState {
  feed: FeedItem[];
  loading: boolean;
  error: string | null;
}

export function useFeed(userId: string | undefined) {
  const [state, setState] = useState<FeedState>({ feed: [], loading: false, error: null });
  const isFetching = useRef(false);

  const fetchFeed = useCallback(async () => {
    if (!userId || isFetching.current) return;
    isFetching.current = true;
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const result = await buildFeed(userId, 20);
      setState(s => ({ ...s, feed: result.feed, loading: false }));
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: (e as Error).message }));
    } finally {
      isFetching.current = false;
    }
  }, [userId]);

  const fetchMore = useCallback(async () => {
    if (!userId || isFetching.current) return;
    isFetching.current = true;

    try {
      const result = await buildFeed(userId, 20);
      setState(s => ({ ...s, feed: [...s.feed, ...result.feed] }));
    } catch {
      // Silently fail on pagination
    } finally {
      isFetching.current = false;
    }
  }, [userId]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return { ...state, refresh: fetchFeed, fetchMore };
}
