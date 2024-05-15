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
import { knowledgeColors } from '../helpers/colors';
import DeckCreateModal from './DeckCreateModal';
import DeckUpdateModal from './DeckUpdateModal';
import WordCreateModal from './WordCreateModal';
import { TabBarIcon } from '../ui/TabBarIcon';
import PressableArea from '../ui/PressableArea';

export type RootStackParamList = {
  Decks: { userId: string };
  DeckView: { currentDeckId: number; currentDeckName: string; deckColor: string };
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
              <PressableArea
                chromeless
                size="small"
                onPress={() => navigation.navigate('DeckCreateModal')}
              >
                <TabBarIcon name="plus-square" />
              </PressableArea>
            ),
          })}
        />
        <Stack.Screen
          name="DeckView"
          component={DeckView}
          options={({ route, navigation }) => ({
            headerTitle: route.params.currentDeckName,
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <PressableArea
                  chromeless
                  size="small"
                  onPress={() =>
                    navigation.navigate('DeckUpdateModal', {
                      parentDeckId: route.params.currentDeckId,
                    })
                  }
                >
                  <TabBarIcon name="edit" />
                </PressableArea>
                <PressableArea
                  chromeless
                  size="small"
                  onPress={() => handleDeleteDeck(route.params.currentDeckId, navigation)}
                >
                  <TabBarIcon name="trash-o" />
                </PressableArea>
              </View>
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
            headerShadowVisible: false,
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
