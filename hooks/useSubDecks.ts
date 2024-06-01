import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';

async function getSubDecks(parentDeck: number) {
  const { data, error } = await supabase
    .from('decks')
    .select()
    .eq('parent_deck', parentDeck)
    .order('id');

  if (error) throw error;
  return data;
}

export const useSubDecks = (parentDeck: number) =>
  useQuery({
    queryKey: ['subDecks', parentDeck],
    queryFn: () => getSubDecks(parentDeck),
  });
