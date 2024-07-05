import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Alert, Platform, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import ListOfDecks from './ListOfDecks';
import DeckView from './DeckView';
import useDeleteDeck from '../../hooks/useDeleteDeck';
import Word from './Word';
import DeckCreateModal from './DeckCreateModal';
import DeckUpdateModal from './DeckUpdateModal';
import WordCreateModal from './WordCreateModal';
import { TabBarIcon } from '../../ui/TabBarIcon';
import Button from '../../ui/Button';
import { StudyingView } from './StudyingView';
import { WordType } from '../../types/WordType';
import useDeleteWord from '../../hooks/useDeleteWord';
import { DeckType } from '../../types/Deck';
import { useDecks } from '../../hooks/useDecks';
import { sessionStore } from '../../features/sessionStore';
import useUser from '../../hooks/useUser';
import Loader from '../../components/Loader';
import SubscriptionOffer from '../SubscriptionOffer';
import { defaultColors } from '../../helpers/colors';
import { pushStore } from '../../features/pushStore';

export type RootStackParamList = {
  Decks: undefined;
  DeckView: { deck: DeckType };
  DecksAndWordsTabs: undefined;
  Word: { word: WordType };
  DeckCreateModal: { parentDeckId: number };
  DeckUpdateModal: { deck: DeckType };
  WordCreateModal: { deck: DeckType };
  Studying: { deckId: number; revise: boolean };
  SubscriptionOffer: undefined;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function scheduleDailyNotification(hour: number, minute: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      sound: 'default',
      title: 'Learn new words',
      body: "Don't forget to study today!",
      data: { someData: 'goes here' },
    },
    trigger: {
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    handleRegistrationError('Must use physical device for push notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    handleRegistrationError('Permission not granted to get push token for push notification!');
    return;
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError('Project ID not found');
    return;
  }

  try {
    const pushTokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    return pushTokenData.data;
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
  }
}

const HomeView = observer(() => {
  const { mutateAsync: deleteDeck, isPending: deckIsBeingDeleted } = useDeleteDeck();
  const { mutateAsync: deleteWord, isPending: wordIsBeingDeleted } = useDeleteWord();
  const { data: decks } = useDecks(sessionStore.session?.user.id || '');
  const { data: user } = useUser(sessionStore.session?.user.id || '');
  const Stack = createNativeStackNavigator<RootStackParamList>();

  async function checkAndScheduleNotification() {
    const userDate = new Date(pushStore.time);

    try {
      if (pushStore.push) {
        // if remainders are allowed
        Notifications.cancelAllScheduledNotificationsAsync().then(async () => {
          await scheduleDailyNotification(userDate.getHours(), userDate.getMinutes());
        });
      } else {
        // if remainders are not allowed
        Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          checkAndScheduleNotification();
        }
      })
      .catch((error: any) => console.error(error));
  }, []);

  useEffect(() => {
    checkAndScheduleNotification();
  }, [pushStore.time, pushStore.push]);

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

  if (!user || !decks) {
    return <Loader />;
  }

  return (
    <Stack.Navigator initialRouteName="Decks">
      <Stack.Group>
        <Stack.Screen
          name="Decks"
          component={ListOfDecks}
          options={({ navigation }) => ({
            gestureEnabled: false,
            headerTitle: 'My Decks',
            headerShadowVisible: false,
            headerRight: () => (
              <Button
                isDisabled={!user.pro && decks?.length > 1}
                chromeless
                size="small"
                onPress={() => navigation.navigate('DeckCreateModal')}
              >
                <TabBarIcon
                  name="plus-square"
                  color={!user.pro && decks?.length > 1 ? 'grey' : undefined}
                />
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
        <Stack.Screen
          name="SubscriptionOffer"
          component={SubscriptionOffer}
          options={{
            headerShadowVisible: false,
            headerTitle: 'Unlock WordEm Pro Features',
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
              color: defaultColors.activeColor,
            },
            // headerBackVisible: true,
            // headerBackTitleVisible: true,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
});

export default HomeView;
