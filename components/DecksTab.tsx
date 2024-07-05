import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import useUser from '../hooks/useUser';
import { sessionStore } from '../features/sessionStore';
import LockedFeature from './LockedFeature';
import ListItem from '../ui/ListItem';
import ListItemSkeleton from '../ui/ListItemSkeleton';
import { useDecks } from '../hooks/useDecks';
import { RootStackParamList } from '../views/home/HomeView';
import { useMemo } from 'react';

type Props = {
  deckId: number;
};

const DecksTab = observer(({ deckId }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useUser(sessionStore.session?.user.id || '');

  const {
    data: decks,
    error: decksError,
    isLoading: decksLoading,
  } = useDecks(sessionStore.session?.user.id || '');

  const subDecks = useMemo(() => decks?.filter((d) => d.parent_deck === deckId), [decks, deckId]);

  if (!user || userLoading || decksLoading) {
    return <ActivityIndicator />;
  } else if (userError || decksError) {
    return <Text style={styles.errorText}>Failed to load data</Text>;
  } else if (!user.pro) {
    return <LockedFeature text="Get pro version to view and create sub decks" />;
  } else if (!subDecks) {
    return (
      <FlashList
        estimatedItemSize={44}
        renderItem={() => <ListItemSkeleton height={44} />}
        data={[...Array(8)]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  }

  return (
    <View style={styles.container} key="2">
      <FlashList
        estimatedItemSize={44}
        data={subDecks}
        ListEmptyComponent={<Text style={styles.emptyText}>No decks</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={<View style={styles.footer} />}
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
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  separator: {
    height: 10,
  },
  footer: {
    height: 50,
  },
  emptyText: {
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
});

export default DecksTab;
