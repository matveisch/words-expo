import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';
import { defaultColors } from '../helpers/colors';

type Props = {
  text?: string;
  backgroundColor?: string;
  borderColor?: string;
};

export default function Circle(props: Props & PressableProps) {
  const { text, borderColor = defaultColors.subColor, backgroundColor, ...otherProps } = props;

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
    borderRadius: 8,
    height: 40,
    flex: 1,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
