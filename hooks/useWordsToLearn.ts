import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';

async function getWords(deck_ids: number[], revise: boolean, words_limit: number) {
  let { data, error } = await supabase.rpc('limited_words', {
    deck_ids,
    revise,
    words_limit,
  });

  if (error) throw error;
  return data;
}

export const useWordsToLearn = (
  currentDeckId: number,
  deckIds: number[],
  subDecksLoaded: boolean,
  limit: number,
  revise: boolean
) =>
  useQuery({
    queryKey: ['words', currentDeckId, deckIds, subDecksLoaded, revise],
    queryFn: () => getWords(deckIds, revise, limit),
    enabled: !!subDecksLoaded,
  });
