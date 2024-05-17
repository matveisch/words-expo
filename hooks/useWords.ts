import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';
import { WordType } from '../types/WordType';

export const useWords = (deckId: number) =>
  useQuery({
    queryKey: ['words', deckId],
    queryFn: () => supabase.from('words').select().eq('deck', deckId).order('id'),
    // @ts-ignore
    select: (data): WordType[] => data.data,
  });
