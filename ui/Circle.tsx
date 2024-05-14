import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { defaultColors } from '../helpers/colors';

type Props = {
  text?: string;
  backgroundColor?: string;
  borderColor?: string;
};

export default function Circle(props: Props & PressableProps) {
  const { text, borderColor = defaultColors.grey, backgroundColor, ...otherProps } = props;

  return (
    <Pressable
      style={[styles.container, { backgroundColor: backgroundColor, borderColor: borderColor }]}
      {...otherProps}
    >
      {text && <Text>{text}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    height: 40,
    width: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
