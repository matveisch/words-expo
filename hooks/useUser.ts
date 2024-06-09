import { supabase } from '../helpers/initSupabase';
import { useQuery } from '@tanstack/react-query';

async function getUser(userId: string) {
  const { data: user, error } = await supabase.from('users').select().eq('user_uid', userId);

  if (error) throw error;
  return user;
}

function useUser(userId: string) {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(userId),
  });
}

export default useUser;
