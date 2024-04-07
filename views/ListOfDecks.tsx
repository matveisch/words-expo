import { Text, View } from '@tamagui/core';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import { ListItem } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';
import { useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavigationProps } from '../App';
import { DataContext, DataContextType } from '../helpers/DataContext';
import Word from '../helpers/Word';
import Deck from '../helpers/Deck';

const dogWord = new Word('dog', 'собака', 'дог', 4);
const catWord = new Word('cat', 'кошка', 'кэт', 2);
const newDeck = new Deck('animals', [dogWord, catWord]);
const secondDeck = new Deck('another animals', [dogWord, catWord]);
const otherDeck = new Deck(
  'animals too',
  [
    dogWord,
    catWord,
    dogWord,
    catWord,
    dogWord,
    catWord,
    dogWord,
    catWord,
    dogWord,
    catWord,
    dogWord,
    catWord,
  ],
  [newDeck, secondDeck, newDeck, secondDeck, newDeck, secondDeck, newDeck, secondDeck]
);

const decks = [
  newDeck,
  secondDeck,
  newDeck,
  secondDeck,
  newDeck,
  secondDeck,
  newDeck,
  secondDeck,
  otherDeck,
];

export default function ListOfDecks({ navigation }: NavigationProps) {
  const insets = useSafeAreaInsets();
  const { setCurrentDeck } = useContext(DataContext) as DataContextType;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        height: '100%',
        paddingHorizontal: 10,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingTop: 10,
      }}
    >
      <View flex={1}>
        <FlashList
          estimatedItemSize={44}
          data={decks}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <ListItem
              iconAfter={ChevronRight}
              pressTheme
              borderRadius={9}
              title={item.name}
              onPress={() => {
                setCurrentDeck(item);
                navigation.navigate('DeckView');
              }}
            />
          )}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}