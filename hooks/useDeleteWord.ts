import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function deleteWord(wordId: number) {
  const { error } = await supabase.from('words').delete().eq('id', wordId).single();

  if (error) throw error;
}

export default function useDeleteWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wordId: number) => deleteWord(wordId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['words'] }),
  });
}
