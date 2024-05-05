import { DeckType } from '../types/Deck';
import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type noUserIdDeck = Omit<DeckType, 'user_id' | 'id'>;

async function addDeck(deck: noUserIdDeck) {
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;

  const deckToAdd = {
    ...deck,
    user_id: data.user?.id,
  };

  const { error } = await supabase.from('decks').upsert(deckToAdd).single();

  if (error) throw error;
}

export default function useAddDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deck: noUserIdDeck) => addDeck(deck),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['decks'] }),
  });
}
