import { View, StyleSheet, Image, ImageSourcePropType, Text } from 'react-native';

type Props = {
  text: string;
  subText: string;
  icon: ImageSourcePropType;
};

export default function SubscriptionItem(props: Props) {
  const { text, icon, subText } = props;

  return (
    <View style={styles.container}>
      <Image source={icon} style={{ width: 80, height: 80 }} />
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontSize: 20 }}>{text}</Text>
        <Text style={{ color: 'grey', fontSize: 16 }}>{subText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});
