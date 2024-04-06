import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
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
  const mouseWord = new Word('mouse', 'мышь', 'маус', 1);
  const newWord = new Word('123', 'мышь', 'маус', 1);
  const newDeck = new Deck('animals', [dogWord, catWord]);
  const secondDeck = new Deck('another animals', [dogWord, catWord]);
  const otherDeck = new Deck(
    'animals too',
    [
      dogWord,
      catWord,
      mouseWord,
      dogWord,
      catWord,
      mouseWord,
      dogWord,
      catWord,
      mouseWord,
      dogWord,
      catWord,
      mouseWord,
      dogWord,
      catWord,
      mouseWord,
      dogWord,
      catWord,
      mouseWord,
      newWord,
    ],
    [newDeck, secondDeck, newDeck, secondDeck, newDeck, secondDeck, newDeck, secondDeck]
  );

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <SafeAreaView>
        <View style={styles.container}>
          <DeckView deck={otherDeck} />
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});
