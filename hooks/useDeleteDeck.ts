import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function deleteDeck(deckId: number) {
  const { error } = await supabase.from('decks').delete().eq('id', deckId).single();

  if (error) throw error;
}

export default function useDeleteDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deckId: number) => deleteDeck(deckId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['decks'] }),
  });
}