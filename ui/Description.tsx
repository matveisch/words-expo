import { StyleSheet, View, Text } from 'react-native';

interface Props {
  text: string;
}

export default function Description(props: Props) {
  const { text } = props;

  return (
    <View>
      <Text style={styles.description}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 10,
    color: 'grey',
  },
});
