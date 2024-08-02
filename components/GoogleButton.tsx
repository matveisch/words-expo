import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { observer } from 'mobx-react-lite';

import { supabase } from '../helpers/initSupabase';
import useAddUser from '../hooks/useAddUser';
import { sessionStore } from '../features/sessionStore';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';

const logError = (step: string, error: any) => {
  console.error(
    `MYAPP ERROR [${step}]: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
  );
};

const logInfo = (step: string, info: any) => {
  console.log(`MYAPP INFO [${step}]: ${JSON.stringify(info)}`);
};

const GoogleButton = observer(() => {
  const { mutate } = useAddUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('MYAPP ENV [extra]:', JSON.stringify(Constants.expoConfig?.extra));
    console.log('MYAPP ENV [webClientId]:', Constants.expoConfig?.extra?.webClientId);
    console.log('MYAPP ENV [iosClientId]:', Constants.expoConfig?.extra?.iosClientId);
  }, []);

  logInfo('ConfigureGoogleSignIn', 'Starting configuration');
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    // @ts-ignore
    webClientId: process.env.WEB_CLIENT_ID,
    // @ts-ignore
    iosClientId: process.env.IOS_CLIENT_ID,
  });
  logInfo('ConfigureGoogleSignIn', 'Configuration complete');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      logInfo('CheckPlayServices', 'Checking Play Services');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      logInfo('CheckPlayServices', 'Play Services check passed');

      logInfo('GoogleSignIn', 'Starting sign-in');
      const userInfo = await GoogleSignin.signIn();
      logInfo('GoogleSignIn', 'Sign-in successful');

      if (userInfo.idToken) {
        logInfo('SupabaseSignIn', 'Starting Supabase sign-in');
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.idToken,
        });
        logInfo('SupabaseSignIn', 'Supabase sign-in complete');

        if (error) {
          throw new Error(`Supabase sign-in error: ${error.message}`);
        }

        if (data.user) {
          logInfo('AddUser', 'Adding user to database');
          mutate({
            name: '',
            email: data.user.email || '',
            pro: false,
            user_uid: data.user.id,
          });
        }

        logInfo('SetSession', 'Setting session');
        sessionStore.setSession(data.session);
      } else {
        throw new Error('No ID token present in Google Sign-In response');
      }

      logInfo('SignInProcess', 'Sign-in process completed successfully');
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        logError('GoogleSignIn', 'User cancelled the sign-in process');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        logError('GoogleSignIn', 'Sign-in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        logError('GoogleSignIn', 'Play Services not available or outdated');
      } else {
        logError('GoogleSignIn', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleGoogleSignIn}>
      <View style={styles.contentWrapper}>
        {isLoading ? (
          <ActivityIndicator color="#1f1f1f" />
        ) : (
          <>
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
          </>
        )}
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
