import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WordType } from '../types/WordType';

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
      queryClient.setQueriesData({ queryKey: ['words'] }, (oldData: WordType[] | undefined) => {
        if (oldData instanceof Array) {
          const arrayToUpdate = [...oldData];
          const updatedIndex = arrayToUpdate.findIndex((w) => w.id === updatedWord.id);
          if (updatedIndex !== -1) {
            arrayToUpdate[updatedIndex] = updatedWord;
            return arrayToUpdate;
          }
        }
      });
    },
  });
}
