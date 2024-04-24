import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchDecks = async () => {
  const { data } = await axios.get('');
  return data;
};

const usePosts = () =>
  useQuery({
    queryKey: ['decks'],
    queryFn: fetchDecks,
  });
export default usePosts;
