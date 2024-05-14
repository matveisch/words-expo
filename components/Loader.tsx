import { View } from 'react-native';
import { TabBarIcon } from '../ui/TabBarIcon';

export default function Loader() {
  return (
    // todo: animate spinner
    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <TabBarIcon name="spinner" color="hsl(24, 100%, 75.3%)" />
    </View>
  );
}
