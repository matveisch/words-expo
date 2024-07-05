import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type WordToUpdate = {
  id: number;
  word?: string;
  meaning?: string;
  pronunciation?: string;
  knowledgelevel?: number;
};

async function updateWord(word: WordToUpdate) {
  const { data, error } = await supabase
    .from('words')
    .update({
      word: word.word,
      meaning: word.meaning,
      pronunciation: word.pronunciation,
      knowledgelevel: word.knowledgelevel,
    })
    .eq('id', word.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export default function useUpdateWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (word: WordToUpdate) => updateWord(word),
    onSuccess: (updatedWord) => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['wordsCount'] });
    },
  });
}
