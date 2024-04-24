import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://cpsynqohyobfkkbkljle.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY

// Better put your these secret keys in .env file
export const supabase = createClient(supabaseUrl, supabaseKey || '');