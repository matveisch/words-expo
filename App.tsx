import { createTamagui, TamaguiProvider } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import { loadFonts } from './helpers/loadFonts';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DataContext, DataContextType } from './helpers/DataContext';
import Deck from './helpers/Deck';
import DeckView from './views/DeckView';
import ListOfDecks from './views/ListOfDecks';
import { Button } from 'tamagui';
import { BookPlus } from '@tamagui/lucide-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const tamaguiConfig = createTamagui(config);

type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export type RootStackParamList = {
  Decks: undefined;
  DeckView: { currentDeck: Deck };
  DecksAndWordsTabs: undefined;
};

export type NavigationProps = NativeStackScreenProps<RootStackParamList>;

const queryClient = new QueryClient();

export default function App() {
  const [openCreateDeckModal, setOpenCreateDeckModal] = useState(false);
  const DataContextValue = { openCreateDeckModal, setOpenCreateDeckModal } as DataContextType;
  const Stack = createNativeStackNavigator<RootStackParamList>();

  if (!loadFonts()) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <QueryClientProvider client={queryClient}>
        <DataContext.Provider value={DataContextValue}>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Decks">
                <Stack.Screen
                  name="Decks"
                  component={ListOfDecks}
                  options={{
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
                    headerTitle: route.params.currentDeck?.name,
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
