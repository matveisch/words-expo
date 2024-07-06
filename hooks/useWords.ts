import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';

async function getWords(deckIds: number[], page: number, limit: number) {
  const { data, error } = await supabase
    .from('words')
    .select()
    .in('deck', deckIds)
    .order('id', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) throw error;
  return data;
}

export const useWords = (currentDeckId: number, deckIds: number[], subDecksLoaded: boolean) =>
  useInfiniteQuery({
    queryKey: ['words', currentDeckId, deckIds, subDecksLoaded],
    queryFn: ({ pageParam = 1 }) => getWords(deckIds, pageParam, 20),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    enabled: !!subDecksLoaded,
    initialPageParam: 1,
  });
