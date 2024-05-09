import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import ListOfDecks from './ListOfDecks';
import { Button, XStack } from 'tamagui';
import DeckView from './DeckView';
import { loadFonts } from '../helpers/loadFonts';
import { RootTabsParamList } from '../App';
import useDeleteDeck from '../hooks/useDeleteDeck';
import { Alert } from 'react-native';
import Word from './Word';
import { knowledgeColors } from '../helpers/colors';
import DeckCreateModal from './DeckCreateModal';
import DeckUpdateModal from './DeckUpdateModal';
import WordCreateModal from './WordCreateModal';
import { TabBarIcon } from '../ui/TabBarIcon';

export type RootStackParamList = {
  Decks: { userId: string };
  DeckView: { currentDeckId: number; currentDeckName: string };
  DecksAndWordsTabs: undefined;
  Word: { wordId: number; knowledgeLevel: number };
  DeckCreateModal: { parentDeckId: number };
  DeckUpdateModal: { parentDeckId: number };
  WordCreateModal: { parentDeckId: number };
};

interface Props extends NativeStackScreenProps<RootTabsParamList, 'Home'> {}

const HomeView = ({ route }: Props) => {
  const { session } = route.params;
  const { mutateAsync } = useDeleteDeck();
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
          mutateAsync(deckId).then(() => navigation.goBack());
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
                <TabBarIcon name="plus-square" />
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
                <Button
                  size="$2"
                  chromeless
                  onPress={() =>
                    navigation.navigate('DeckUpdateModal', {
                      parentDeckId: route.params.currentDeckId,
                    })
                  }
                >
                  <TabBarIcon name="edit" />
                </Button>
                <Button
                  size="$2"
                  chromeless
                  onPress={() => handleDeleteDeck(route.params.currentDeckId, navigation)}
                >
                  <TabBarIcon name="trash-o" />
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
        <Stack.Screen
          name="WordCreateModal"
          component={WordCreateModal}
          options={{
            headerTitle: 'New Word',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default HomeView;
