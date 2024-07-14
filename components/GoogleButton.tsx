import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { observer } from 'mobx-react-lite';

import { supabase } from '../helpers/initSupabase';
import useAddUser from '../hooks/useAddUser';
import { sessionStore } from '../features/sessionStore';

const GoogleButton = observer(() => {
  const { mutate } = useAddUser();

  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '103397523372-i20enh919kus9mgpot7udhg5rd1qs22h.apps.googleusercontent.com',
    iosClientId: '103397523372-funlghn7h0g24gab9mhou0avk878l25e.apps.googleusercontent.com',
    // androidClientId: '103397523372-5dm3q4i307cjnit97c93qmnrn4mbhnhj.apps.googleusercontent.com',
  });

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          if (userInfo.idToken) {
            const {
              data: { user, session },
              error,
            } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: userInfo.idToken,
            });

            // console.log(user, session, error);

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
            throw new Error('no ID token present!');
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.icon}>
          <Svg viewBox="0 0 48 48" style={{ height: 20, width: 20 }}>
            <Path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></Path>
            <Path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></Path>
            <Path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></Path>
            <Path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></Path>
            <Path fill="none" d="M0 0h48v48H0z"></Path>
          </Svg>
        </View>
        <Text style={styles.text}>Sign in with Google</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    // backgroundColor: '#131314',
    // borderColor: '#8e918f',
    backgroundColor: 'white',
    borderColor: '#747775',

    borderWidth: 1,
    borderRadius: 6,
    padding: 0,
    height: 50,
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  icon: {
    height: 20,
    width: 20,
    marginRight: 12,
  },
  text: {
    // color: '#e3e3e3',
    color: '#1f1f1f',

    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
});

export default GoogleButton;
