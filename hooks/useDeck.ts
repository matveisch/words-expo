import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';
import { DeckType } from '../types/Deck';

export const useDeck = (id: number) =>
  useQuery({
    queryKey: ['deck', id],
    queryFn: () => supabase.from('decks').select().eq('id', id).single(),

    select: (data): DeckType => {
      // @ts-ignore
      if (data.data.length) {
        // @ts-ignore
        return data.data[0];
      } else {
        // @ts-ignore
        return data.data;
      }
    },
  });
