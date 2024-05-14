import { View, StyleSheet, Text, ViewProps } from 'react-native';

type Props = {
  text: string;
  color: string;
};

export default function ChartItem(props: Props & ViewProps) {
  const { text, color, ...otherProps } = props;

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color }]} {...otherProps} />
      <Text>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 5,
  },
});
