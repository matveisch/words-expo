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
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

const tamaguiConfig = createTamagui(config);

//type Conf = typeof tamaguiConfig;
//declare module '@tamagui/core' {
//  interface TamaguiCustomConfig extends Conf {}
//}

export type RootStackParamList = {
  Decks: undefined;
  DeckView: { currentDeckId: number; currentDeckName: string };
  DecksAndWordsTabs: undefined;
};

export type NavigationProps = NativeStackScreenProps<RootStackParamList>;

const queryClient = new QueryClient({
  defaultOptions: {
    // queries: {
    //   staleTime: Infinity,
    //   gcTime: Infinity,
    //   retry: 0,
    // },
  },
});

const asyncPersist = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

// queryClient.setMutationDefaults(['decks'], {
//   mutationFn: async ({ deck }) => {
//     return supabase.from('decks').insert({ deck });
//   },
// });

export default function App() {
  const [openCreateDeckModal, setOpenCreateDeckModal] = useState(false);
  const DataContextValue = { openCreateDeckModal, setOpenCreateDeckModal } as DataContextType;
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return NetInfo.addEventListener((state) => {
        const status =
          state.isConnected != null && state.isConnected && Boolean(state.isInternetReachable);
        onlineManager.setOnline(status);
      });
    }
  }, []);

  if (!loadFonts()) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncPersist,
        }}
        // onSuccess will be called when the initial restore is finished
        // resumePausedMutations will trigger any paused mutations
        // that was initially triggered when the device was offline
        onSuccess={() => queryClient.resumePausedMutations()}
      >
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
                    headerTitle: route.params.currentDeckName,
                    headerBackTitleVisible: false,
                  })}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </DataContext.Provider>
      </PersistQueryClientProvider>
    </TamaguiProvider>
  );
}
