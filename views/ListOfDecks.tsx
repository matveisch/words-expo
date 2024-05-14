import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDecks } from '../hooks/useDecks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeView';
import Loader from '../components/Loader';
import ListItem from '../ui/ListItem';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Decks'> {}

const ListOfDecks = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const { userId } = route.params;
  const { data: decks, isLoading } = useDecks(userId);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View
      style={{
        height: '100%',
        paddingHorizontal: 10,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingTop: 10,
      }}
    >
      <View style={{ flex: 1 }}>
        <FlashList
          estimatedItemSize={44}
          data={decks}
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No decks</Text>}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <ListItem
              backgroundColor={item.color ? item.color : undefined}
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
};

export default ListOfDecks;
