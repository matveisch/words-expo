import { View, StyleSheet, Text } from 'react-native';
import { TabBarIcon } from '../ui/TabBarIcon';
import { defaultColors } from '../helpers/colors';

type Props = {
  text: string;
};

export default function LockedFeature(props: Props) {
  const { text } = props;

  return (
    <View style={styles.container}>
      <TabBarIcon name="lock" size={100} />
      <Text style={{ fontSize: 16, textAlign: 'center' }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 20,
    backgroundColor: defaultColors.subColor,
    borderRadius: 8,
  },
});
