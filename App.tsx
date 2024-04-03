import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { createTamagui, TamaguiProvider, View } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import { loadFonts } from './helpers/loadFonts';
import DeckView from './views/DeckView';

const tamaguiConfig = createTamagui(config);

type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default function App() {
  if (!loadFonts()) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <View style={styles.container}>
        <DeckView name="Hebrew" />
        <StatusBar style="auto" />
      </View>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // borderStyle: 'solid',
    // borderColor: 'black',
    // borderWidth: 1,
  },
});
