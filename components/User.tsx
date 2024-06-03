import { View, Text } from 'react-native';

import { supabase } from '../helpers/initSupabase';
import Button from '../ui/Button';
import { sessionStore } from '../features/sessionStore';
import { observer } from 'mobx-react';

const User = observer(() => {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    sessionStore.setSession(null);
  }

  return (
    <View style={{ marginTop: 20 }}>
      <Button onPress={handleSignOut}>
        <Text>Sign out</Text>
      </Button>
    </View>
  );
});

export default User;
