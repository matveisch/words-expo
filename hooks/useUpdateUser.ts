import { supabase } from '../helpers/initSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function updateUser(userId: string, proStatus: boolean) {
  const { data, error } = await supabase
    .from('users')
    .update({ pro: proStatus })
    .eq('user_uid', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export default function useUpdateUser(userId: string, proStatus: boolean) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateUser(userId, proStatus),
    onSuccess: (newUser) => queryClient.setQueriesData({ queryKey: ['user'] }, newUser),
  });
}
