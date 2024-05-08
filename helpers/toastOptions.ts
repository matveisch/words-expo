import Toast from 'react-native-root-toast';
import { colors } from './colors';

export const toastOptions = {
  duration: Toast.durations.SHORT,
  position: Toast.positions.TOP,
  backgroundColor: colors[0],
  opacity: 1,
  shadow: false,
  textColor: 'black',
};
