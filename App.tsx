import {
  DefaultTheme,
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  RouteProp,
  Theme,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QueryClientProvider from './components/QueryClientProvider';
import { Session } from '@supabase/supabase-js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootSiblingParent } from 'react-native-root-siblings';
import { observer } from 'mobx-react';

import { supabase } from './helpers/initSupabase';
import HomeView from './views/HomeView';
import SettingsView from './views/SettingsView';
import { TabBarIcon } from './ui/TabBarIcon';
import { sessionStore } from './features/sessionStore';
import OnboardingView from './views/OnboardingView';

export type RootTabsParamList = {
  Home: { session: Session };
  Settings: undefined;
};

export type NavigationProps = NativeStackScreenProps<RootTabsParamList>;

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

  const getTabBarStyle = (route: RouteProp<RootTabsParamList>) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    return routeName === 'Studying' ? 'none' : 'flex';
  };

  return (
    <RootSiblingParent>
      <QueryClientProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={MyTheme}>
            {sessionStore.session ? (
              <Tab.Navigator>
                <Tab.Screen
                  name="Home"
                  component={HomeView}
                  options={({ route }) => ({
                    tabBarStyle: { display: getTabBarStyle(route) },
                    headerShown: false,
                    headerShadowVisible: false,
                    tabBarIcon: () => <TabBarIcon name="home" />,
                  })}
                />
                <Tab.Screen
                  name="Settings"
                  component={SettingsView}
                  options={{
                    tabBarIcon: () => <TabBarIcon name="gear" />,
                    headerShadowVisible: false,
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
