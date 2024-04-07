import { createTamagui, TamaguiProvider } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import { loadFonts } from './helpers/loadFonts';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DataContext, DataContextType } from './helpers/DataContext';
import Deck from './helpers/Deck';
import DeckView from './views/DeckView';
import ListOfDecks from './views/ListOfDecks';

const tamaguiConfig = createTamagui(config);

type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

type RootStackParamList = {
  Decks: undefined;
  DeckView: { currentDeck: Deck };
};

type DeckViewNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DeckViewRouteProp = RouteProp<RootStackParamList>;

export type NavigationProps = {
  navigation: DeckViewNavigationProp;
  route: DeckViewRouteProp;
};

// export type NavigationProps = NativeStackScreenProps<RootStackParamList>;

export default function App() {
  const [currentDeck, setCurrentDeck] = useState<Deck>();
  const DataContextValue = { currentDeck, setCurrentDeck } as DataContextType;
  const Stack = createNativeStackNavigator<RootStackParamList>();

  if (!loadFonts()) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <DataContext.Provider value={DataContextValue}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Decks">
              <Stack.Screen
                name="Decks"
                component={ListOfDecks}
                options={{ headerTitle: 'My Decks' }}
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
    </TamaguiProvider>
  );
}
