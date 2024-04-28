import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';
import { Word } from '../types/Word';

export const useWords = (deckId: number) =>
  useQuery({
    queryKey: ['words'],
    queryFn: () => supabase.from('words').select().eq('deck', deckId),
    // @ts-ignore
    select: (data): Word[] => data.data,
  });
