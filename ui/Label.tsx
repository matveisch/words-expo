import { StyleSheet, View, Text } from 'react-native';

interface Props {
  text: string;
}

export default function Label(props: Props) {
  const { text } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  label: {},
});
