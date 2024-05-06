import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import ListOfDecks from './ListOfDecks';
import { Button } from 'tamagui';
import { BookPlus, Trash2 } from '@tamagui/lucide-icons';
import DeckView from './DeckView';
import { loadFonts } from '../helpers/loadFonts';
import { RootTabsParamList } from '../App';
import useDeleteDeck from '../hooks/useDeleteDeck';
import { observer } from 'mobx-react';
import { modalStore } from '../ModalStore';

export type RootStackParamList = {
  Decks: { userId: string };
  DeckView: { currentDeckId: number; currentDeckName: string };
  DecksAndWordsTabs: undefined;
};

interface Props extends NativeStackScreenProps<RootTabsParamList, 'Home'> {}

const Home = observer(({ route }: Props) => {
  const { session } = route.params;

  const deleteDeck = useDeleteDeck();
  const Stack = createNativeStackNavigator<RootStackParamList>();

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
            <Button size="$2" chromeless onPress={() => modalStore.openModal()}>
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
  );
});

export default Home;
