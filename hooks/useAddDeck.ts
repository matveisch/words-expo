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

  const { error, data: addedDeck } = await supabase
    .from('decks')
    .upsert(deckToAdd)
    .select()
    .single();

  if (error) throw error;
  return addedDeck;
}

export default function useAddDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deck: noUserIdDeck) => addDeck(deck),
    onSuccess: (newDeck) => {
      if (newDeck.parent_deck === null) {
        queryClient.setQueriesData({ queryKey: ['decks'] }, (oldDecks) => {
          if (oldDecks instanceof Array) {
            return [newDeck, ...oldDecks];
          }
        });
      } else {
        queryClient.setQueriesData({ queryKey: ['subDecks'] }, (oldDecks) => {
          if (oldDecks instanceof Array) {
            return [newDeck, ...oldDecks];
          }
        });
      }
    },
  });
}
