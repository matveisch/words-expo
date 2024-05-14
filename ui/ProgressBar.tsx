import { StyleSheet, View } from 'react-native';

type Props = {
  progress: number;
};

export function ProgressBar(props: Props) {
  const { progress } = props;

  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: progress ? `${progress}%` : 0 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 11,
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  bar: {
    height: 11,
    backgroundColor: '#00CD5E',
    borderRadius: 10,
  },
});
