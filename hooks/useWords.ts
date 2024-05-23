import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';
import { WordType } from '../types/WordType';

export const useWords = (deckIds: number[], subDecksLoaded: boolean) =>
  useQuery({
    queryKey: ['words', deckIds, subDecksLoaded],
    queryFn: () => supabase.from('words').select().in('deck', deckIds).order('id'),
    // @ts-ignore
    select: (data): WordType[] => data.data,
    enabled: !!subDecksLoaded,
  });
