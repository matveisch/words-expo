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
import { Alert } from 'react-native';
import Word from './Word';
import { knowledgeColors } from '../helpers/colors';
import DeckCreateModal from './DeckCreateModal';
import DeckUpdateModal from './DeckUpdateModal';

export type RootStackParamList = {
  Decks: { userId: string };
  DeckView: { currentDeckId: number; currentDeckName: string };
  DecksAndWordsTabs: undefined;
  Word: { wordId: number; knowledgeLevel: number };
  DeckCreateModal: undefined;
  DeckUpdateModal: undefined;
};

interface Props extends NativeStackScreenProps<RootTabsParamList, 'Home'> {}

const HomeView = observer(({ route }: Props) => {
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
      <Stack.Group>
        <Stack.Screen
          name="Decks"
          initialParams={{ userId: session?.user?.id }}
          component={ListOfDecks}
          options={({ navigation }) => ({
            gestureEnabled: false,
            headerBackVisible: false,
            headerTitle: 'My Decks',
            headerRight: () => (
              <Button size="$2" chromeless onPress={() => navigation.navigate('DeckCreateModal')}>
                <BookPlus />
              </Button>
            ),
          })}
        />
        <Stack.Screen
          name="DeckView"
          component={DeckView}
          options={({ route, navigation }) => ({
            headerTitle: route.params.currentDeckName,
            headerBackTitleVisible: false,
            headerRight: () => (
              <XStack>
                <Button size="$2" chromeless onPress={() => navigation.navigate('DeckCreateModal')}>
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
        <Stack.Screen
          name="Word"
          component={Word}
          options={({ route }) => ({
            headerTitle: 'Edit Word',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: knowledgeColors[route.params.knowledgeLevel - 1],
            },
          })}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="DeckCreateModal"
          component={DeckCreateModal}
          options={{
            headerTitle: 'New Deck',
          }}
        />
        <Stack.Screen
          name="DeckUpdateModal"
          component={DeckUpdateModal}
          options={{
            headerTitle: 'Edit Deck',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
});

export default HomeView;
