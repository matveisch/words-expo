import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchDecks = async (deckId: string) => {
  const { data } = await axios.get('');
  return data;
};

const usePost = (deckId: string) =>
  useQuery({
    queryKey: ['decks', deckId],
    queryFn: () => fetchDecks(deckId),
  });
export default usePost;
