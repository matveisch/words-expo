import { FlashList } from '@shopify/flash-list';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../views/home/HomeLayout';
import { observer } from 'mobx-react-lite';
import { useMemo, useRef, useState } from 'react';

import ListItem from '../ui/ListItem';
import Stats from './Stats';
import StudyButtons from './StudyButtons';
import LockedFeature from './LockedFeature';
import ListItemSkeleton from '../ui/ListItemSkeleton';
import { sessionStore } from '../features/sessionStore';
import { useWords } from '../hooks/useWords';
import useUser from '../hooks/useUser';
import { defaultColors } from '../helpers/colors';
import ThemedText from '../ui/ThemedText';
import Button from '../ui/Button';
import Search from './Search';
import { WordType } from '../types/WordType';

type Props = {
  deckId: number;
  parentDeckId: number | null;
};

const WordsTab = observer(({ deckId, parentDeckId }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [foundWords, setFoundWords] = useState<WordType[]>([]);
  const flashListRef = useRef<FlashList<WordType> | null>(null);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUser(sessionStore.session?.user.id || '');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: wordsLoading,
    error: wordsError,
  } = useWords(deckId, parentDeckId);
  // Combine all pages into a single array
  const words = useMemo(() => data?.pages.flat() || [], [data]);

  const scrollPastHeader = () => {
    flashListRef.current?.scrollToOffset({
      offset: 224,
      animated: true,
    });
  };

  if (userLoading || wordsLoading) {
    return (
      <FlashList
        estimatedItemSize={65}
        showsVerticalScrollIndicator={false}
        renderItem={() => <ListItemSkeleton height={65} />}
        data={[...Array(8)]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  } else if (userError || wordsError) {
    return <Text style={styles.errorText}>Failed to load data</Text>;
  }

  return (
    <View style={styles.container} key="1">
      <FlashList
        keyboardShouldPersistTaps="handled"
        ref={flashListRef}
        onEndReached={() => {
          if (hasNextPage && user?.pro) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={65}
        data={user?.pro ? (foundWords.length > 0 ? foundWords : words) : words.slice(0, 20)}
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
            {foundWords.length < 1 && (
              <View>
                <Stats deckId={deckId} parentDeckId={parentDeckId} />
                <StudyButtons deckId={deckId} parentDeckId={parentDeckId} />
              </View>
            )}
            {user?.pro && <Search setFoundWords={setFoundWords} onInput={scrollPastHeader} />}
          </View>
        }
        ListFooterComponent={
          !user?.pro && words.length > 19 ? (
            <View style={styles.lockedFeature}>
              <LockedFeature text="Get pro version to view and create more than 20 words" />
              <View style={styles.footer} />
            </View>
          ) : (
            <View style={styles.footer} />
          )
        }
      />

      <Button
        backgroundColor={defaultColors.activeColor}
        onPress={() =>
          navigation.navigate('WordCreateModal', {
            deckId: deckId,
            parentDeckId: parentDeckId,
          })
        }
        style={styles.newItemButton}
        isDisabled={words.length > 19 && !user?.pro}
      >
        <ThemedText text={`Add new word`} />
      </Button>
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
  newItemButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
});

export default WordsTab;
