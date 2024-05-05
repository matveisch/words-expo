import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import ListOfDecks from './ListOfDecks';
import { Button } from 'tamagui';
import { BookPlus, Trash2 } from '@tamagui/lucide-icons';
import DeckView from './DeckView';
import { useState } from 'react';
import { loadFonts } from '../helpers/loadFonts';
import { DataContextType, DataContext } from '../helpers/DataContext';
import { RootTabsParamList } from '../App';
import useDeleteDeck from '../hooks/useDeleteDeck';

export type RootStackParamList = {
  Decks: { userId: string };
  DeckView: { currentDeckId: number; currentDeckName: string };
  DecksAndWordsTabs: undefined;
};

interface Props extends NativeStackScreenProps<RootTabsParamList, 'Home'> {}

export default function Home({ route }: Props) {
  const [openCreateDeckModal, setOpenCreateDeckModal] = useState(false);
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const DataContextValue = { openCreateDeckModal, setOpenCreateDeckModal } as DataContextType;
  const { session } = route.params;
  const deleteDeck = useDeleteDeck();

  function handleDeleteDeck(
    deckId: number,
    navigation: NativeStackNavigationProp<RootStackParamList, 'DeckView', undefined>
  ) {
    deleteDeck.mutate(deckId);
    navigation.goBack();

    // todo handle delete confirmation
  }

  if (!loadFonts()) {
    return null;
  }

  return (
    <DataContext.Provider value={DataContextValue}>
      <Stack.Navigator initialRouteName="Decks">
        <Stack.Screen
          name="Decks"
          initialParams={{ userId: session?.user?.id }}
          component={ListOfDecks}
          options={{
            gestureEnabled: false,
            headerBackVisible: false,
            headerTitle: 'My Decks',
            headerRight: () => (
              <Button size="$2" chromeless onPress={() => setOpenCreateDeckModal(true)}>
                <BookPlus />
              </Button>
            ),
          }}
        />
        <Stack.Screen
          name="DeckView"
          component={DeckView}
          options={({ route, navigation }) => ({
            headerTitle: route.params.currentDeckName,
            headerBackTitleVisible: false,
            headerRight: () => (
              <Button
                size="$2"
                chromeless
                onPress={() => handleDeleteDeck(route.params.currentDeckId, navigation)}
              >
                <Trash2 />
              </Button>
            ),
          })}
        />
      </Stack.Navigator>
    </DataContext.Provider>
  );
}
