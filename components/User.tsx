import { View, Text, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useQueryClient } from '@tanstack/react-query';
import { AuthError, PostgrestError } from '@supabase/supabase-js';

import { supabase } from '../helpers/initSupabase';
import Button from '../ui/Button';
import { sessionStore } from '../features/sessionStore';
import { autoCheckStore } from '../features/autoCheckStore';
import { wordsLimitStore } from '../features/wordsLimitStore';
import { defaultColors } from '../helpers/colors';
import { supabaseAdmin } from '../helpers/supabaseAdmin';

const User = observer(() => {
  const queryClient = useQueryClient();

  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }

      // Reset session and other stores
      sessionStore.setSession(null);
      autoCheckStore.setAutoCheck(true);
      wordsLimitStore.setLimit(20);
      queryClient.clear();
    } catch (e) {
      console.error('Failed to sign out:', e);
      throw e;
    }
  }

  async function deleteUser() {
    Alert.alert('Are you sure?', 'You are about to delete your account', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => handleDeleteUser(),
      },
    ]);
  }

  async function handleDeleteUser() {
    const handleDeleteError = (error: AuthError | PostgrestError | null, context: string) => {
      if (error) {
        console.error(`Error deleting ${context}:`, error);
        throw error;
      }
    };

    try {
      const userId = sessionStore.session?.user.id;
      if (!userId) return;

      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      handleDeleteError(authDeleteError, 'auth user');

      const { error: userDeleteError } = await supabase
        .from('users')
        .delete()
        .eq('user_uid', userId);
      handleDeleteError(userDeleteError, 'user record');

      const { error } = await supabase.from('decks').delete().eq('user_id', userId);
      handleDeleteError(error, 'decks');

      // Reset session and other stores
      sessionStore.setSession(null);
      autoCheckStore.setAutoCheck(true);
      wordsLimitStore.setLimit(20);
      queryClient.clear();
    } catch (e) {
      console.error('Failed to delete user:', e);
      throw e;
    }
  }

  return (
    <View style={{ marginTop: 20, gap: 10 }}>
      <Button onPress={handleSignOut}>
        <Text>Sign out</Text>
      </Button>
      <Button style={{ backgroundColor: defaultColors.errorColor }} onPress={deleteUser}>
        <Text>Delete account</Text>
      </Button>
    </View>
  );
});

export default User;
