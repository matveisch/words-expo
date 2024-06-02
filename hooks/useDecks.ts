import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';

async function getDecks(userId: string) {
  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .eq('user_id', userId)
    .order('id');

  if (error) throw error;
  return data;
}

export const useDecks = (userId: string) =>
  useQuery({
    queryKey: ['decks'],
    queryFn: () => getDecks(userId),
  });
