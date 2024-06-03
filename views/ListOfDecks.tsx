import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useDecks } from '../hooks/useDecks';
import { RootStackParamList } from './HomeView';
import Loader from '../components/Loader';
import ListItem from '../ui/ListItem';
import { observer } from 'mobx-react';
import { sessionStore } from '../features/sessionStore';
import Animated, { SlideInRight } from 'react-native-reanimated';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Decks'> {}

const ListOfDecks = observer(({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { data: decks, isLoading } = useDecks(sessionStore.session?.user.id || '');

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Animated.View
      entering={SlideInRight}
      style={{
        height: '100%',
        paddingHorizontal: 10,
        // paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingTop: 10,
      }}
    >
      <View style={{ flex: 1 }}>
        <FlashList
          estimatedItemSize={44}
          data={decks?.filter((deck) => deck.parent_deck === null)}
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No decks</Text>}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <ListItem
              backgroundColor={item.color ? item.color : undefined}
              title={item.name}
              onPress={() => {
                navigation.navigate('DeckView', {
                  deck: item,
                });
              }}
            />
          )}
        />
      </View>
      <StatusBar style="auto" />
    </Animated.View>
  );
});

export default ListOfDecks;
