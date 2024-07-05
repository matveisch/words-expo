import { WordType } from '../types/WordType';
import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeckType } from '../types/Deck';

type NoIdWord = Omit<WordType, 'id'>;

async function addWord(word: NoIdWord) {
  const { error, data } = await supabase.from('words').upsert(word).select().single();

  if (error) throw error;
  return data;
}

export default function useAddWord(deck: DeckType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (word: NoIdWord) => addWord(word),
    onSuccess: (newWord) => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['wordsCount'] });
    },
  });
}
