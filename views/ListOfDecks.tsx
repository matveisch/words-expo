import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import { ListItem, Text, View } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProps } from '../App';
import Word from '../helpers/Word';
import Deck from '../helpers/Deck';
import SheetView from './SheetView';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../helpers/initSupabase';

const dogWord = new Word('dog', 'собака', 'дог', 4);
const catWord = new Word('cat', 'кошка', 'кэт', 2);

const secondDeck = new Deck('another animals', [dogWord, catWord]);
const newSubDeck = new Deck('sub deck', [dogWord, catWord], [secondDeck]);
const parentDeck = new Deck('parent deck', [dogWord, catWord], [newSubDeck]);
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
  [parentDeck, secondDeck, parentDeck, secondDeck, parentDeck, secondDeck, parentDeck, secondDeck]
);

const decks = [
  parentDeck,
  secondDeck,
  parentDeck,
  secondDeck,
  parentDeck,
  secondDeck,
  parentDeck,
  secondDeck,
  otherDeck,
];

export default function ListOfDecks({ navigation }: NavigationProps) {
  const insets = useSafeAreaInsets();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['decks'],
    queryFn: () => supabase.from('decks').select().is('parent_deck', null),
  });

  console.log({ data });

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
        <SheetView />
        <FlashList
          estimatedItemSize={44}
          data={decks}
          ListEmptyComponent={<Text textAlign="center">No decks</Text>}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <ListItem
              iconAfter={ChevronRight}
              pressTheme
              borderRadius={9}
              title={item.name}
              onPress={() => {
                navigation.navigate('DeckView', { currentDeck: item });
              }}
            />
          )}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
