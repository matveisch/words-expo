import { supabase } from '../helpers/initSupabase';
import { useMutation } from '@tanstack/react-query';

interface User {
  email: string;
  password: string;
}

async function signUpWithEmail(user: User) {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
  });

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error('Please check your inbox for email verification!');
  }

  return data.user;
}

export default function useCreateUser(user: User) {
  return useMutation({
    mutationFn: () => signUpWithEmail(user),
  });
}
