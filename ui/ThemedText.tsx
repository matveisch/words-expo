import { Text, TextProps } from 'react-native';
import { defaultColors } from '../helpers/colors';

interface Props extends TextProps {
  text: string;
}

export default function ThemedText(props: Props) {
  const { text, style, ...otherProps } = props;

  return (
    <Text
      style={[
        {
          color: defaultColors.white,
          fontWeight: 700,
        },
        style,
      ]}
      {...otherProps}
    >
      {text}
    </Text>
  );
}
