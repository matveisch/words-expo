import { useMutation, useQueryClient } from '@tanstack/react-query';

import { WordType } from '../types/WordType';
import { supabase } from '../helpers/initSupabase';

type NoIdWord = Omit<WordType, 'id'>;

async function addWord(word: NoIdWord) {
  const { error, data } = await supabase.from('words').upsert(word).select().single();

  if (error) throw error;
  return data;
}

export default function useAddWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (word: NoIdWord) => addWord(word),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['wordsCount'] });
    },
  });
}
