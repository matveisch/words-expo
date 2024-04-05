import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { createTamagui, TamaguiProvider, View } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import { loadFonts } from './helpers/loadFonts';
import DeckView from './views/DeckView';
import Word from './helpers/Word';
import Deck from './helpers/Deck';

const tamaguiConfig = createTamagui(config);

type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default function App() {
  if (!loadFonts()) {
    return null;
  }

  const dogWord = new Word('dog', 'собака', 'дог', 4);
  const catWord = new Word('cat', 'кошка', 'кэт', 2);
  const mouseWord = new Word('mouse', 'мышь', 'моус', 1);
  const newDeck = new Deck('animals', [dogWord, catWord]);
  const otherDeck = new Deck('animals too', [dogWord, catWord, mouseWord], [newDeck]);

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <View style={styles.container}>
        <DeckView deck={otherDeck} />
        <StatusBar style="auto" />
      </View>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,

    // borderStyle: 'solid',
    // borderColor: 'black',
    // borderWidth: 1,
  },
});
