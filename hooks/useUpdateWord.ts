import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Word } from '../types/Word';

type WordToUpdate = Omit<Word, 'deck'>;

async function updateWord(word: WordToUpdate): Promise<void> {
  const { error } = await supabase
    .from('words')
    .update({
      word: word.word,
      meaning: word.meaning,
      pronunciation: word.pronunciation,
      knowledgelevel: word.knowledgelevel,
    })
    .eq('id', word.id)
    .single();

  if (error) throw error;
}

export default function useUpdateWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (word: WordToUpdate) => updateWord(word),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['word'] });
      queryClient.invalidateQueries({ queryKey: ['words'] });
    },
  });
}
