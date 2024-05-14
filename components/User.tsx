import { View, Text } from 'react-native';

import { supabase } from '../helpers/initSupabase';
import PressableArea from '../ui/PressableArea';

export default function User() {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <View style={{ marginTop: 20 }}>
      <PressableArea onPress={handleSignOut}>
        <Text>Sign out</Text>
      </PressableArea>
    </View>
  );
}
