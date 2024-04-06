import { createTamagui, TamaguiProvider } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import { loadFonts } from './helpers/loadFonts';
import Deck from './helpers/Deck';
import ListOfDecks from './views/ListOfDecks';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeckView from './views/DeckView';
import { useState } from 'react';
import { DataContext, DataContextType } from './helpers/DataContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const tamaguiConfig = createTamagui(config);

type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

type RootStackParamList = {
  Decks: undefined;
  DeckView: undefined;
};

export type Props = NativeStackScreenProps<RootStackParamList, 'Decks', 'DeckView'>;

export default function App() {
  if (!loadFonts()) {
    return null;
  }

  const [currentDeck, setCurrentDeck] = useState<Deck>();
  const DataContextValue = { currentDeck, setCurrentDeck } as DataContextType;
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <DataContext.Provider value={DataContextValue}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Decks">
              <Stack.Screen name="Decks" component={ListOfDecks} />
              <Stack.Screen name="DeckView" component={DeckView} options={{ headerTitle: '' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </DataContext.Provider>
    </TamaguiProvider>
  );
}
