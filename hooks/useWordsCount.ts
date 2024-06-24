import { supabase } from '../helpers/initSupabase';
import { useQuery } from '@tanstack/react-query';

async function wordsCount(deckIds: number[], knowledgeLevel?: number) {
  let query = supabase
    .from('words')
    .select('*', { count: 'estimated', head: true })
    .in('deck', deckIds);

  if (knowledgeLevel) {
    query = query.eq('knowledgelevel', knowledgeLevel);
  }

  const { count, error } = await query;

  if (error) throw error;
  return count;
}

export const useWordsCount = (
  currentDeckId: number,
  deckIds: number[],
  subDecksLoaded: boolean,
  knowledgeLevel?: number
) => {
  return useQuery({
    queryKey: ['wordsCount', currentDeckId, deckIds, knowledgeLevel],
    queryFn: () => wordsCount(deckIds, knowledgeLevel),
    enabled: !!subDecksLoaded,
  });
};
