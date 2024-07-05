import { FlashList } from '@shopify/flash-list';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../views/home/HomeView';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

import ListItem from '../ui/ListItem';
import Stats from './Stats';
import StudyButtons from './StudyButtons';
import LockedFeature from './LockedFeature';
import ListItemSkeleton from '../ui/ListItemSkeleton';
import { useDecks } from '../hooks/useDecks';
import { sessionStore } from '../features/sessionStore';
import { useWords } from '../hooks/useWords';
import useUser from '../hooks/useUser';

type Props = {
  deckId: number;
};

const WordsTab = observer(({ deckId }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUser(sessionStore.session?.user.id || '');

  const {
    data: decks,
    isFetched: decksFetched,
    isLoading: decksLoading,
    error: decksError,
  } = useDecks(sessionStore.session?.user.id || '');

  const subDecks = useMemo(() => decks?.filter((d) => d.parent_deck === deckId), [decks, deckId]);
  const decksIds = useMemo(
    () => [...(subDecks?.map((deck) => deck.id) || []), deckId],
    [subDecks, deckId]
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: wordsLoading,
    error: wordsError,
  } = useWords(deckId, decksIds, decksFetched);
  // Combine all pages into a single array
  const words = useMemo(() => data?.pages.flat() || [], [data]);

  if (userLoading || decksLoading || wordsLoading) {
    return (
      <FlashList
        estimatedItemSize={65}
        showsVerticalScrollIndicator={false}
        renderItem={() => <ListItemSkeleton height={65} />}
        data={[...Array(8)]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  } else if (userError || decksError || wordsError) {
    return <Text style={styles.errorText}>Failed to load data</Text>;
  }

  return (
    <View style={styles.container} key="1">
      <FlashList
        onEndReached={() => {
          if (hasNextPage && user?.pro) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={65}
        data={user?.pro ? words : words.slice(0, 20)}
        ListEmptyComponent={<Text style={styles.emptyText}>No words</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <ListItem
            title={item.word}
            subTitle={item.meaning}
            onPress={() => {
              navigation.push('Word', {
                word: item,
              });
            }}
          />
        )}
        ListHeaderComponent={
          <View>
            <Stats deckId={deckId} />
            <StudyButtons deckId={deckId} />
            {/*<Input placeholder="Search" />*/}
          </View>
        }
        ListFooterComponent={
          !user?.pro && words?.length && words.length > 19 ? (
            <View style={styles.lockedFeature}>
              <LockedFeature text="Get pro version to view and create more than 20 words" />
            </View>
          ) : (
            <View style={styles.footer} />
          )
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 10,
  },
  footer: {
    height: 80,
  },
  lockedFeature: {
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
});

export default WordsTab;
