import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type User = {
  name: string;
  email: string;
  pro: boolean;
  user_uid: string;
};

async function addUser(user: User) {
  const { data: newUser, error } = await supabase.from('users').upsert(user).select().single();

  if (error) throw error;
  return newUser;
}

function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => addUser(user),
    onSuccess: (newUser) => {
      queryClient.setQueriesData({ queryKey: ['user'] }, newUser);
    },
  });
}

export default useAddUser;
