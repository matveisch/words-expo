import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TabBarIcon } from '../ui/TabBarIcon';
import { defaultColors } from '../helpers/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../views/HomeView';

type Props = {
  text: string;
};

export default function LockedFeature(props: Props) {
  const { text } = props;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'SubscriptionOffer'>>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('SubscriptionOffer')}
    >
      <TabBarIcon name="lock" size={100} />
      <Text style={{ fontSize: 16, textAlign: 'center' }}>{text}</Text>
    </TouchableOpacity>
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
