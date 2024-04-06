import { Text, View } from '@tamagui/core';
import { StatusBar } from 'expo-status-bar';
import Word from '../helpers/Word';
import Deck from '../helpers/Deck';
import { FlashList } from '@shopify/flash-list';
import { ListItem } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';
import { Props } from '../App';
import { useContext } from 'react';
import { DataContext, DataContextType } from '../helpers/DataContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function ListOfDecks({ navigation }: Props) {
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
      }}
    >
      <Text fontSize={20} paddingBottom={10}>
        Your Decks
      </Text>
      <View flex={1}>
        <FlashList
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
