import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import ListOfDecks from './ListOfDecks';
import { Button } from 'tamagui';
import { BookPlus } from '@tamagui/lucide-icons';
import DeckView from './DeckView';
import { useState } from 'react';
import { loadFonts } from '../helpers/loadFonts';
import { DataContextType, DataContext } from '../helpers/DataContext';
import { RootTabsParamList } from '../App';

export type RootStackParamList = {
  Decks: { userId: string };
  DeckView: { currentDeckId: number; currentDeckName: string };
  DecksAndWordsTabs: undefined;
};

interface Props extends NativeStackScreenProps<RootTabsParamList, 'Home'> {}

export default function Home({ route }: Props) {
  const [openCreateDeckModal, setOpenCreateDeckModal] = useState(false);
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const DataContextValue = { openCreateDeckModal, setOpenCreateDeckModal } as DataContextType;
  const { session } = route.params;

  if (!loadFonts()) {
    return null;
  }

  return (
    <DataContext.Provider value={DataContextValue}>
      <Stack.Navigator initialRouteName="Decks">
        {/*<Stack.Screen*/}
        {/*  name="Auth"*/}
        {/*  component={EmailForm}*/}
        {/*  options={{*/}
        {/*    headerShown: false,*/}
        {/*  }}*/}
        {/*/>*/}
        <Stack.Screen
          name="Decks"
          initialParams={{ userId: session?.user?.id }}
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
    </DataContext.Provider>
  );
}
