import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';

async function getWords(deckId: number, parentDeckId: number | null, page: number, limit: number) {
  let query = supabase
    .from('words')
    .select()
    .order('id', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (parentDeckId !== null) {
    // children decks
    query = query.eq('deck', deckId);
  } else {
    // parent decks
    query = query.eq('parent_deck', deckId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export const useWords = (currentDeckId: number, parentDeckId: number | null) =>
  useInfiniteQuery({
    queryKey: ['words', currentDeckId],
    queryFn: ({ pageParam = 1 }) => getWords(currentDeckId, parentDeckId, pageParam, 20),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
