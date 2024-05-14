import { View } from 'react-native';
import { TabBarIcon } from '../ui/TabBarIcon';

export default function Loader() {
  return (
    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      // todo: animate spinner
      <TabBarIcon name="spinner" color="hsl(24, 100%, 75.3%)" />
    </View>
  );
}
