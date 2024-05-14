import { StyleSheet, Text, View } from 'react-native';

type Props = {
  text: string;
};

export default function InputError(props: Props) {
  const { text } = props;

  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: 'red',
  },
});
