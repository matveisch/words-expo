import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeckType } from '../types/Deck';

type DeckToUpdate = {
  color: string;
  name: string;
  id: number;
};

async function updateDeck(deck: DeckToUpdate) {
  const { data, error } = await supabase
    .from('decks')
    .update({ color: deck.color, name: deck.name })
    .eq('id', deck.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export default function useUpdateDeck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deck: DeckToUpdate) => updateDeck(deck),
    onSuccess: (updatedDeck) => {
      queryClient.setQueriesData({ queryKey: ['decks'] }, (oldData: DeckType[] | undefined) => {
        if (oldData instanceof Array) {
          const arrayToUpdate = [...oldData];
          const updatedIndex = arrayToUpdate.findIndex((deck) => deck.id === updatedDeck.id);
          if (updatedIndex !== -1) {
            arrayToUpdate[updatedIndex] = updatedDeck;
            return arrayToUpdate;
          }
        }
      });
    },
  });
}
