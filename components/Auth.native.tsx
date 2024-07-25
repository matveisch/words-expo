import { Platform } from 'react-native';
import GoogleButton from './GoogleButton';
import AppleButton from './AppleButton';

export const Auth = () => {
  return (
    <>
      {Platform.OS === 'ios' && <AppleButton />}
      {Platform.OS === 'android' && <GoogleButton />}
    </>
  );
};
