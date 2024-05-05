import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import { ListItem, Text, View } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SheetView from './SheetView';
import { useDecks } from '../hooks/useDecks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Home';
import { useContext } from 'react';
import { DataContext, DataContextType } from '../helpers/DataContext';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Decks'> {}

export default function ListOfDecks({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { userId } = route.params;
  const { openCreateDeckModal, setOpenCreateDeckModal } = useContext(
    DataContext
  ) as DataContextType;
  // todo error handling
  const { data: decks, isError, isLoading, error } = useDecks(userId);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: '#fff',
        height: '100%',
        paddingHorizontal: 10,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingTop: 10,
      }}
    >
      <View flex={1}>
        <SheetView openModal={openCreateDeckModal} setOpenModal={setOpenCreateDeckModal} />
        <FlashList
          estimatedItemSize={44}
          data={decks}
          ListEmptyComponent={<Text textAlign="center">No decks</Text>}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <ListItem
              backgroundColor={item.color ? item.color : undefined}
              iconAfter={ChevronRight}
              pressTheme
              borderRadius={9}
              title={item.name}
              onPress={() => {
                navigation.navigate('DeckView', {
                  currentDeckId: item.id,
                  currentDeckName: item.name,
                });
              }}
            />
          )}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
