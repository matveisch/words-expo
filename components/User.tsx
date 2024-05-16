import { View, Text } from 'react-native';

import { supabase } from '../helpers/initSupabase';
import Button from '../ui/Button';

export default function User() {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <View style={{ marginTop: 20 }}>
      <Button onPress={handleSignOut}>
        <Text>Sign out</Text>
      </Button>
    </View>
  );
}
