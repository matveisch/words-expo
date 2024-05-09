import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { defaultColors } from '../helpers/colors';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  chromeless?: boolean;
};

export default function PressableArea(props: Props & PressableProps) {
  const { chromeless, children, style, ...otherProps } = props;

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? 'rgb(210, 230, 255)'
            : chromeless
              ? '#fff'
              : defaultColors.buttonColor,
        },
        styles.button,
        style,
      ]}
      {...otherProps}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
});
