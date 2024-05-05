import { createTamagui, TamaguiProvider } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import { loadFonts } from './helpers/loadFonts';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DataContext, DataContextType } from './helpers/DataContext';
import DeckView from './views/DeckView';
import ListOfDecks from './views/ListOfDecks';
import { Button } from 'tamagui';
import { BookPlus } from '@tamagui/lucide-icons';
import QueryClientProvider from './components/QueryClientProvider';
import { Session } from '@supabase/supabase-js';
import { supabase } from './helpers/initSupabase';
import EmailForm from './components/EmailForm';

const tamaguiConfig = createTamagui(config);

//type Conf = typeof tamaguiConfig;
//declare module '@tamagui/core' {
//  interface TamaguiCustomConfig extends Conf {}
//}

export type RootStackParamList = {
  Auth: undefined;
  Decks: { userId: string };
  DeckView: { currentDeckId: number; currentDeckName: string };
  DecksAndWordsTabs: undefined;
};

export type NavigationProps = NativeStackScreenProps<RootStackParamList>;

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [openCreateDeckModal, setOpenCreateDeckModal] = useState(false);
  const DataContextValue = { openCreateDeckModal, setOpenCreateDeckModal } as DataContextType;
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!loadFonts()) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <QueryClientProvider>
        <DataContext.Provider value={DataContextValue}>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName={session ? 'Decks' : 'Auth'}>
                <Stack.Screen
                  name="Auth"
                  component={EmailForm}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Decks"
                  initialParams={{ userId: session?.user.id }}
                  component={ListOfDecks}
                  options={{
                    gestureEnabled: false,
                    headerBackVisible: false,
                    headerTitle: 'My Decks',
                    headerRight: () => (
                      <Button size="$2" chromeless onPress={() => setOpenCreateDeckModal(true)}>
                        <BookPlus />
                      </Button>
                    ),
                  }}
                />
                <Stack.Screen
                  name="DeckView"
                  component={DeckView}
                  options={({ route }) => ({
                    headerTitle: route.params.currentDeckName,
                    headerBackTitleVisible: false,
                  })}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </DataContext.Provider>
      </QueryClientProvider>
    </TamaguiProvider>
  );
}
