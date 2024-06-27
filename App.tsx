import {
  DefaultTheme,
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  RouteProp,
  Theme,
} from '@react-navigation/native';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QueryClientProvider from './components/QueryClientProvider';
import { Session } from '@supabase/supabase-js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootSiblingParent } from 'react-native-root-siblings';
import { observer } from 'mobx-react';
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

import { supabase } from './helpers/initSupabase';
import HomeView from './views/home/HomeView';
import SettingsView from './views/settings/SettingsView';
import { TabBarIcon } from './ui/TabBarIcon';
import { sessionStore } from './features/sessionStore';
import OnboardingView from './views/OnboardingView';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export type RootTabsParamList = {
  HomeTab: { session: Session };
  SettingsTab: undefined;
};

const revenueCatKey = process.env.REVENUE_CAT_IOS_KEY;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function scheduleDailyNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      sound: 'default',
      title: 'Learn new words',
      body: "Don't forget to study today!",
      data: { someData: 'goes here' },
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}

async function checkAndScheduleNotification() {
  try {
    const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const hasScheduledNotification = existingNotifications.some(
      (notification) =>
        notification.content.title === 'Learn new words' &&
        notification.content.body === "Don't forget to study today!"
    );

    if (!hasScheduledNotification) {
      await scheduleDailyNotification();
    }
  } catch (e) {
    console.error(e);
  }
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

const App = observer(() => {
  const Tab = createBottomTabNavigator<RootTabsParamList>();

  const MyTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
      primary: 'black',
    },
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      sessionStore.setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      sessionStore.setSession(session);
    });
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          checkAndScheduleNotification();
        }
      })
      .catch((error: any) => console.error(error));
  }, []);

  const getTabBarStyle = (route: RouteProp<RootTabsParamList>) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    return routeName === 'Studying' ? 'none' : 'flex';
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Purchases.configure({
        apiKey: revenueCatKey || '',
      });
    }
  }, []);

  return (
    <RootSiblingParent>
      <QueryClientProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={MyTheme}>
            {sessionStore.session ? (
              <Tab.Navigator>
                <Tab.Screen
                  name="HomeTab"
                  component={HomeView}
                  options={({ route }) => ({
                    tabBarStyle: { display: getTabBarStyle(route) },
                    headerShown: false,
                    tabBarLabel: 'Home',
                    headerShadowVisible: false,
                    tabBarIcon: () => <TabBarIcon name="home" />,
                  })}
                />
                <Tab.Screen
                  name="SettingsTab"
                  component={SettingsView}
                  options={{
                    headerShown: false,
                    headerShadowVisible: false,
                    tabBarLabel: 'Settings',
                    tabBarIcon: () => <TabBarIcon name="gear" />,
                  }}
                />
              </Tab.Navigator>
            ) : (
              <OnboardingView />
            )}
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </RootSiblingParent>
  );
});

export default App;
