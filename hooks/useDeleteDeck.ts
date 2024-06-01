import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeckType } from '../types/Deck';

async function deleteDeck(deckId: number) {
  const { data, error } = await supabase.from('decks').delete().eq('id', deckId).select().single();

  if (error) throw error;
  return data;
}

export default function useDeleteDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteDeck'],
    mutationFn: (deckId: number) => deleteDeck(deckId),
    onSuccess: (deletedDeck) => {
      if (deletedDeck.parent_deck === null) {
        queryClient.setQueriesData({ queryKey: ['decks'] }, (oldData: DeckType[] | undefined) => {
          if (oldData instanceof Array) {
            return oldData.filter((deck) => deck.id !== deletedDeck.id);
          }
        });
      } else {
        queryClient.setQueriesData(
          { queryKey: ['subDecks'] },
          (oldData: DeckType[] | undefined) => {
            if (oldData instanceof Array) {
              return oldData.filter((deck) => deck.id !== deletedDeck.id);
            }
          }
        );
      }
    },
  });
}
