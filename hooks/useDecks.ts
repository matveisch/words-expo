import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';
import { DeckType } from '../types/Deck';

export const useDecks = () =>
  useQuery({
    queryKey: ['decks'],
    queryFn: () => supabase.from('decks').select(),
    // @ts-ignore
    select: (data): DeckType[] => data.data.filter((item) => item.parent_deck === null),
  });
