import { Spinner } from 'tamagui';
import { View } from '@tamagui/core';

export default function Loader() {
  return (
    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size="large" color="hsl(24, 100%, 75.3%)" />
    </View>
  );
}
