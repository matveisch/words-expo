import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';
import { DeckType } from '../types/Deck';

export const useSubDecks = (parentDeck: number) =>
  useQuery({
    queryKey: ['subDecks', parentDeck],
    queryFn: () => supabase.from('decks').select().eq('parent_deck', parentDeck),
    // @ts-ignore
    select: (data): DeckType[] => data.data,
  });
