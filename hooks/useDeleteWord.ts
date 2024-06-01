import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WordType } from '../types/WordType';

async function deleteWord(wordId: number) {
  const { data, error } = await supabase.from('words').delete().eq('id', wordId).select().single();

  if (error) throw error;
  return data;
}

export default function useDeleteWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wordId: number) => deleteWord(wordId),
    onSuccess: (deletedWord) => {
      queryClient.setQueriesData({ queryKey: ['words'] }, (oldData: WordType[] | undefined) => {
        if (oldData instanceof Array) {
          return oldData.filter((deck) => deck.id !== deletedWord.id);
        }
      });
    },
  });
}
