import { StyleSheet, TextInput } from 'react-native';
import { defaultColors } from '../helpers/colors';

type Props = TextInput['props'];

export default function Input(props: Props) {
  const { style, ...otherProps } = props;

  return <TextInput style={[styles.input, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: defaultColors.subColor,
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
