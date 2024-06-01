import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';

async function getWords(deckIds: number[]) {
  const { data, error } = await supabase
    .from('words')
    .select()
    .in('deck', deckIds)
    .order('id', { ascending: false });

  if (error) throw error;
  return data;
}

export const useWords = (deckIds: number[], subDecksLoaded: boolean) =>
  useQuery({
    queryKey: ['words', deckIds, subDecksLoaded],
    queryFn: () => getWords(deckIds),
    enabled: !!subDecksLoaded,
  });
