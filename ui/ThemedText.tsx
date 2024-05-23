import { Text } from 'react-native';
import { defaultColors } from '../helpers/colors';

type Props = {
  text: string;
};

export default function ThemedText(props: Props) {
  const { text } = props;

  return (
    <Text
      style={{
        color: defaultColors.white,
        fontWeight: 700,
      }}
    >
      {text}
    </Text>
  );
}
