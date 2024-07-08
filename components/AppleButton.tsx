import { StyleSheet } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { observer } from 'mobx-react-lite';

import { supabase } from '../helpers/initSupabase';
import { sessionStore } from '../features/sessionStore';
import useAddUser from '../hooks/useAddUser';

const AppleButton = observer(() => {
  const { mutate } = useAddUser();

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={styles.button}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          // Sign in via Supabase Auth.
          if (credential.identityToken) {
            const {
              error,
              data: { user, session },
            } = await supabase.auth.signInWithIdToken({
              provider: 'apple',
              token: credential.identityToken,
            });

            if (!error) {
              if (user)
                mutate({
                  name: '',
                  email: user.email || '',
                  pro: false,
                  user_uid: user?.id,
                });
              sessionStore.setSession(session);
            }
          } else {
            throw new Error('No identityToken.');
          }
        } catch (e: any) {
          if (e.code === 'ERR_REQUEST_CANCELED') {
            // handle that the user canceled the sign-in flow
          } else {
            // handle other errors
          }
        }
      }}
    />
  );
});

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    marginBottom: 5,
    maxWidth: 400,
  },
});

export default AppleButton;
