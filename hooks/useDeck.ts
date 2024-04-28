import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';
import { DeckType } from '../types/Deck';

export const useDeck = (id: number) =>
  useQuery({
    queryKey: ['deck'],
    queryFn: () => supabase.from('decks').select().eq('id', id),
    // @ts-ignore
    select: (data): DeckType => data.data,
  });
