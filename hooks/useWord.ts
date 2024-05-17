import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';
import { Word } from '../types/Word';

export default function useWord(wordId: number, knowledgeLevel?: number) {
  return useQuery({
    queryKey: ['word', wordId, knowledgeLevel],
    queryFn: () => supabase.from('words').select().eq('id', wordId).order('id').single(),
    select: (data): Word => {
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
}
