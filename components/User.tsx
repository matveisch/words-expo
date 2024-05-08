import { Button, View } from 'tamagui';
import { supabase } from '../helpers/initSupabase';

export default function User() {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <View marginTop={20}>
      <Button onPress={handleSignOut}>Sign out</Button>
    </View>
  );
}
