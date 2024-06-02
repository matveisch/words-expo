import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Alert, View } from 'react-native';

import ListOfDecks from './ListOfDecks';
import DeckView from './DeckView';
import { RootTabsParamList } from '../App';
import useDeleteDeck from '../hooks/useDeleteDeck';
import Word from './Word';
import DeckCreateModal from './DeckCreateModal';
import DeckUpdateModal from './DeckUpdateModal';
import WordCreateModal from './WordCreateModal';
import { TabBarIcon } from '../ui/TabBarIcon';
import Button from '../ui/Button';
import { StudyingView } from './StudyingView';
import { WordType } from '../types/WordType';
import useDeleteWord from '../hooks/useDeleteWord';
import { DeckType } from '../types/Deck';

export type RootStackParamList = {
  Decks: { userId: string };
  DeckView: { deck: DeckType };
  DecksAndWordsTabs: undefined;
  Word: { word: WordType };
  DeckCreateModal: { parentDeckId: number };
  DeckUpdateModal: { deck: DeckType };
  WordCreateModal: { parentDeckId: number };
  Studying: { deckId: number; revise: boolean };
};

interface Props extends NativeStackScreenProps<RootTabsParamList, 'Home'> {}

const HomeView = ({ route }: Props) => {
  const { session } = route.params;
  const { mutateAsync: deleteDeck, isPending: deckIsBeingDeleted } = useDeleteDeck();
  const { mutateAsync: deleteWord, isPending: wordIsBeingDeleted } = useDeleteWord();
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
          deleteDeck(deckId).then(() => navigation.goBack());
        },
      },
    ]);
  }

  function handleDeleteWord(
    wordId: number,
    navigation: NativeStackNavigationProp<RootStackParamList, 'DeckView', undefined>
  ) {
    Alert.alert('Are you sure?', 'You are about to delete the word', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          deleteWord(wordId).then(() => navigation.goBack());
        },
      },
    ]);
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
            headerTitle: 'My Decks',
            headerShadowVisible: false,
            headerRight: () => (
              <Button
                chromeless
                size="small"
                onPress={() => navigation.navigate('DeckCreateModal')}
              >
                <TabBarIcon name="plus-square" />
              </Button>
            ),
          })}
        />

        <Stack.Screen
          name="DeckView"
          component={DeckView}
          options={({ route, navigation }) => ({
            headerTitle: '',
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Button
                  chromeless
                  size="small"
                  disabled={deckIsBeingDeleted}
                  onPress={() =>
                    navigation.navigate('DeckUpdateModal', {
                      deck: route.params.deck,
                    })
                  }
                >
                  <TabBarIcon name="edit" />
                </Button>
                <Button
                  chromeless
                  size="small"
                  disabled={deckIsBeingDeleted}
                  onPress={() => handleDeleteDeck(route.params.deck.id, navigation)}
                >
                  <TabBarIcon name="trash-o" />
                </Button>
              </View>
            ),
          })}
        />

        <Stack.Screen
          name="Word"
          component={Word}
          options={({ route, navigation }) => ({
            headerTitle: 'Edit Word',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            headerRight: () => (
              <Button
                chromeless
                size="small"
                disabled={wordIsBeingDeleted}
                onPress={() => handleDeleteWord(route.params.word.id, navigation)}
              >
                <TabBarIcon name="trash-o" />
              </Button>
            ),
          })}
        />
        <Stack.Screen
          name="Studying"
          component={StudyingView}
          options={({ navigation }) => ({
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerBackVisible: false,
            headerTitle: '',
            headerLeft: () => (
              <Button chromeless size="small" onPress={() => navigation.goBack()}>
                <TabBarIcon name="close" />
              </Button>
            ),
          })}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="DeckCreateModal"
          component={DeckCreateModal}
          options={{
            headerTitle: 'New Deck',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="DeckUpdateModal"
          component={DeckUpdateModal}
          options={{
            headerTitle: 'Edit Deck',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="WordCreateModal"
          component={WordCreateModal}
          options={{
            headerTitle: 'New Word',
            headerShadowVisible: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default HomeView;
