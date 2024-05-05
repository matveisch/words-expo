import { createTamagui, TamaguiProvider } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import { loadFonts } from './helpers/loadFonts';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QueryClientProvider from './components/QueryClientProvider';
import { Session } from '@supabase/supabase-js';
import { supabase } from './helpers/initSupabase';
import EmailForm from './components/EmailForm';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './views/Home';
import Settings from './views/Settings';

const tamaguiConfig = createTamagui(config);

//type Conf = typeof tamaguiConfig;
//declare module '@tamagui/core' {
//  interface TamaguiCustomConfig extends Conf {}
//}

export type RootTabsParamList = {
  Home: { session: Session };
  Settings: undefined;
};

export type NavigationProps = NativeStackScreenProps<RootTabsParamList>;

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const Tab = createBottomTabNavigator<RootTabsParamList>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  console.log(session?.user.id);

  if (!loadFonts()) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <QueryClientProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            {session ? (
              <Tab.Navigator>
                <Tab.Screen
                  name="Home"
                  component={Home}
                  initialParams={{ session: session }}
                  options={{ headerShown: false }}
                />
                <Tab.Screen name="Settings" component={Settings} />
              </Tab.Navigator>
            ) : (
              <EmailForm />
            )}
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </TamaguiProvider>
  );
}
