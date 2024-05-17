import { WordType } from '../types/WordType';
import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type NoIdWord = Omit<WordType, 'id'>;

async function addWord(word: NoIdWord) {
  const { error } = await supabase.from('words').upsert(word).single();

  if (error) throw error;
}

export default function useAddWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (word: NoIdWord) => addWord(word),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['words'] }),
  });
}
