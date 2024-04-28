import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from './supabase';

const supabaseUrl = 'https://cpsynqohyobfkkbkljle.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// Better put your these secret keys in .env file
export const supabase = createClient<Database>(supabaseUrl, supabaseKey || '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
