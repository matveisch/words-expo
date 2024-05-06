import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type DeckToUpdate = {
  color: string;
  name: string;
  id: number;
};

async function updateDeck(deck: DeckToUpdate): Promise<void> {
  const { error } = await supabase
    .from('decks')
    .update({ color: deck.color, name: deck.name })
    .eq('id', deck.id)
    .single();
  if (error) throw error;
}

export default function useUpdateDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deck: DeckToUpdate) => updateDeck(deck),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['decks'] }),
  });
}
