import { WordType } from '../types/WordType';
import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    onSuccess: (newWord) => {
      queryClient.setQueriesData({ queryKey: ['words'] }, (oldWords) => {
        if (oldWords instanceof Array) {
          return [newWord, ...oldWords];
        }
      });
    },
  });
}
