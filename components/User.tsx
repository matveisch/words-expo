import { View, Text } from 'react-native';

import { supabase } from '../helpers/initSupabase';
import Button from '../ui/Button';
import { sessionStore } from '../features/sessionStore';
import { observer } from 'mobx-react';
import { useQueryClient } from '@tanstack/react-query';
import { autoCheckStore } from '../features/autoCheckStore';
import { wordsLimitStore } from '../features/wordsLimitStore';

const User = observer(() => {
  const queryClient = useQueryClient();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    sessionStore.setSession(null);
    autoCheckStore.setAutoCheck(true);
    wordsLimitStore.setLimit(20);
    queryClient.clear();
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
