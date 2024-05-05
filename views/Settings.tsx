import { View, Text } from 'tamagui';
import User from '../components/User';

export default function Settings() {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        height: '100%',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Text>Settings</Text>
      <User />
    </View>
  );
}
