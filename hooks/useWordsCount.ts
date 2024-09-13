import { useQueries } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';

type WordCounts = {
  again: number;
  hard: number;
  good: number;
  easy: number;
  total: number;
};

async function newWordsCount(deckId: number, isParentDeck: boolean, knowledgeLevel?: number) {
  let query = supabase.from('words').select('*', { count: 'estimated', head: true });

  // which words to fetch – either ones for parent deck or for child one
  if (isParentDeck) {
    query = query.eq('parent_deck', deckId);
  } else {
    query = query.eq('deck', deckId);
  }

  if (knowledgeLevel) {
    query = query.eq('knowledgelevel', knowledgeLevel);
  }

  const { count, error } = await query;

  if (error) throw error;
  return count;
}

export const useWordsCount = (currentDeckId: number, isParentDeck: boolean) => {
  return useQueries({
    queries: [undefined, 1, 2, 3, 4, 5, 6, 7, 8].map((level) => ({
      queryKey: ['wordsCount', currentDeckId, isParentDeck, level],
      queryFn: () => newWordsCount(currentDeckId, isParentDeck, level),
    })),
    combine: (results) => {
      return {
        data: results.map((result) => (result.data ? result.data : 0)),
        pending: results.some((result) => result.isPending),
        error: results.some((result) => result.error),
      };
    },
  });
};
