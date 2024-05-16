import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { defaultColors } from '../helpers/colors';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  chromeless?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'default';
  outlined?: boolean;
};

export default function PressableArea(props: Props & PressableProps) {
  const { chromeless, outlined, size, backgroundColor, children, style, ...otherProps } = props;

  function getBackgroundColor(pressed: boolean) {
    if (pressed) {
      return 'rgb(210, 230, 255)';
    } else {
      if (chromeless) {
        return 'transparent';
      } else if (backgroundColor) {
        return backgroundColor;
      } else if (outlined) {
        return 'transparent';
      } else {
        return defaultColors.subColor;
      }
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: getBackgroundColor(pressed),
          height: size === 'small' ? undefined : 44,
          paddingHorizontal: size === 'small' ? undefined : 18,
          padding: size === 'small' ? 5 : undefined,
          borderWidth: outlined ? 2 : undefined,
          borderColor: outlined ? defaultColors.subColor : undefined,
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
  },
});
