import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import ListOfDecks from './ListOfDecks';
import { Button, XStack } from 'tamagui';
import { BookPlus, Pencil, Trash2 } from '@tamagui/lucide-icons';
import DeckView from './DeckView';
import { loadFonts } from '../helpers/loadFonts';
import { RootTabsParamList } from '../App';
import useDeleteDeck from '../hooks/useDeleteDeck';
import { observer } from 'mobx-react';
import { modalStore } from '../helpers/ModalStore';
import { Alert } from 'react-native';
import { deckModalStore } from '../helpers/DeckModalStore';

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
    Alert.alert('Are you sure?', 'All of your sub decks are about to be deleted as well', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          deleteDeck.mutate(deckId);
          navigation.goBack();
        },
      },
    ]);
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
            <Button size="$2" chromeless onPress={() => modalStore.handleModal(true)}>
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
            <XStack>
              <Button size="$2" chromeless onPress={() => deckModalStore.setIsDeckModalOpen(true)}>
                <Pencil />
              </Button>
              <Button
                size="$2"
                chromeless
                onPress={() => handleDeleteDeck(route.params.currentDeckId, navigation)}
              >
                <Trash2 />
              </Button>
            </XStack>
          ),
        })}
      />
    </Stack.Navigator>
  );
});

export default Home;
