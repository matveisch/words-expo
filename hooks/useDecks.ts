import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';
import { DeckType } from '../types/Deck';

export const useDecks = (userId: string) =>
  useQuery({
    queryKey: ['decks'],
    queryFn: () => supabase.from('decks').select('*').is('parent_deck', null).eq('user_id', userId),
    // @ts-ignore
    select: (data): DeckType[] => data.data,
  });
