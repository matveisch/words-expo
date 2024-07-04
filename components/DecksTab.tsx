import { ActivityIndicator, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';

import useUser from '../hooks/useUser';
import { sessionStore } from '../features/sessionStore';
import LockedFeature from './LockedFeature';
import { FlashList } from '@shopify/flash-list';
import ListItem from '../ui/ListItem';
import ListItemSkeleton from '../ui/ListItemSkeleton';
import { useDecks } from '../hooks/useDecks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../views/home/HomeView';

type Props = {
  deckId: number;
};

const DecksTab = observer(({ deckId }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: user } = useUser(sessionStore.session?.user.id || '');
  const { data: decks } = useDecks(sessionStore.session?.user.id || '');
  const subDecks = decks?.filter((d) => d.parent_deck === deckId);

  if (!user) return <ActivityIndicator />;

  if (!user.pro) return <LockedFeature text="Get pro version to view and create sub decks" />;

  return (
    <View style={{ width: '100%', height: '100%' }} key="2">
      {subDecks && (
        <FlashList
          estimatedItemSize={44}
          data={subDecks}
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No decks</Text>}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListFooterComponent={<View style={{ height: 50 }} />}
          renderItem={({ item }) => (
            <ListItem
              backgroundColor={item.color ? item.color : undefined}
              title={item.name}
              onPress={() => {
                navigation.push('DeckView', {
                  deck: item,
                });
              }}
            />
          )}
        />
      )}
      {!subDecks && (
        <FlashList
          estimatedItemSize={44}
          renderItem={() => <ListItemSkeleton height={44} />}
          data={[...Array(8)]}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
});

export default DecksTab;
