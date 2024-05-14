import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QueryClientProvider from './components/QueryClientProvider';
import { Session } from '@supabase/supabase-js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootSiblingParent } from 'react-native-root-siblings';

import { supabase } from './helpers/initSupabase';
import EmailForm from './components/EmailForm';
import HomeView from './views/HomeView';
import SettingsView from './views/SettingsView';
import { TabBarIcon } from './ui/TabBarIcon';

export type RootTabsParamList = {
  Home: { session: Session };
  Settings: undefined;
};

export type NavigationProps = NativeStackScreenProps<RootTabsParamList>;

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const Tab = createBottomTabNavigator<RootTabsParamList>();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
      primary: 'black',
    },
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <RootSiblingParent>
      <QueryClientProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={MyTheme}>
            {session ? (
              <Tab.Navigator>
                <Tab.Screen
                  name="Home"
                  component={HomeView}
                  initialParams={{ session: session }}
                  options={{
                    headerShown: false,
                    tabBarIcon: () => <TabBarIcon name="home" />,
                  }}
                />
                <Tab.Screen
                  name="Settings"
                  component={SettingsView}
                  options={{ tabBarIcon: () => <TabBarIcon name="gear" /> }}
                />
              </Tab.Navigator>
            ) : (
              <EmailForm />
            )}
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </RootSiblingParent>
  );
}
