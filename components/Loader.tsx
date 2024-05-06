import { Spinner } from 'tamagui';
import { orange } from '@tamagui/colors';
import { View } from '@tamagui/core';

export default function Loader() {
  return (
    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size="large" color={orange.orange7} />
    </View>
  );
}
