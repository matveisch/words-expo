import { FlashList } from '@shopify/flash-list';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View, Text } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useWords } from '../hooks/useWords';
import { RootStackParamList } from '../views/home/HomeView';
import Button from '../ui/Button';
import ListItem from '../ui/ListItem';
import { defaultColors } from '../helpers/colors';
import { useIsMutating } from '@tanstack/react-query';
import ThemedText from '../ui/ThemedText';
import { observer } from 'mobx-react';
import { useDecks } from '../hooks/useDecks';
import { sessionStore } from '../features/sessionStore';
import useUser from '../hooks/useUser';
import Loader from './Loader';
import LockedFeature from './LockedFeature';
import ListItemSkeleton from '../ui/ListItemSkeleton';

type Props = {
  currentDeck: number;
  hasParentDeck: boolean;
};

function getIsButtonDisabled(userStatus: boolean, isDeckMutating: number, activeTab: number) {
  if (isDeckMutating !== 0) {
    return true;
  } else {
    if (activeTab === 0) {
      return false;
    } else return !userStatus;
  }
}

const DecksAndWordsTabs = observer((props: Props) => {
  const { currentDeck, hasParentDeck } = props;
  const [activeTab, setActiveTab] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: decks, isFetched } = useDecks(sessionStore.session?.user.id || '');
  const subDecks = decks?.filter((d) => d.parent_deck === currentDeck);

  const decksIds = [...(subDecks?.map((deck) => deck.id) || []), currentDeck];
  const { data, fetchNextPage, hasNextPage } = useWords(currentDeck, decksIds, isFetched);
  // Combine all pages into a single array
  const words = data?.pages.flat() || [];

  const { data: user } = useUser(sessionStore.session?.user.id || '');

  const pagerViewRef = useRef<PagerView | null>(null);
  const offset = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });
  const isDeckMutating = useIsMutating({ mutationKey: ['deleteDeck'] });

  function handleOffset(value: number) {
    offset.value = withSpring(value, {
      mass: 1,
      damping: 100,
      stiffness: 200,
    });
  }

  function handleButtonPress() {
    if (activeTab === 1) {
      navigation.navigate('DeckCreateModal', {
        parentDeckId: currentDeck,
      });
    } else {
      navigation.navigate('WordCreateModal', {
        parentDeckId: currentDeck,
      });
    }
  }

  useEffect(() => {
    if (activeTab === 0) {
      handleOffset(0);
    } else {
      handleOffset(191.3);
    }
  }, [activeTab]);

  if (!user) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            style={{ flex: 1 }}
            onPress={() => {
              handleOffset(0);
              pagerViewRef.current?.setPage(0);
            }}
            backgroundColor="transparent"
          >
            <Text>Words</Text>
          </Button>
          {!hasParentDeck && (
            <Button
              style={{ flex: 1 }}
              onPress={() => {
                handleOffset(191.3);
                pagerViewRef.current?.setPage(1);
              }}
              backgroundColor="transparent"
            >
              <Text>Decks</Text>
            </Button>
          )}
        </View>
        <Animated.View
          style={[
            {
              height: 5,
              width: !hasParentDeck ? 181.7 : 'auto',
              backgroundColor: defaultColors.activeColor,
              borderRadius: 8,
            },
            animatedStyles,
          ]}
        />
      </View>

      <PagerView
        initialPage={0}
        style={{ flex: 1 }}
        ref={pagerViewRef}
        scrollEnabled={!hasParentDeck}
        onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
        // useNext
      >
        <View style={{ width: '100%', height: '100%' }} key="1">
          {words && (
            <FlashList
              onEndReached={() => {
                if (hasNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.5}
              estimatedItemSize={65}
              data={user?.pro ? words : words.slice(0, 20)}
              ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No words</Text>}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
              ListFooterComponent={
                !user?.pro && words?.length && words.length > 19 ? (
                  <View style={{ marginTop: 10 }}>
                    <LockedFeature text="Get pro version to view and create more than 20 words" />
                  </View>
                ) : (
                  <View style={{ height: 80 }} />
                )
              }
            />
          )}
          {!words && (
            <FlashList
              estimatedItemSize={65}
              renderItem={() => <ListItemSkeleton height={65} />}
              data={[...Array(3)]}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          )}
        </View>

        {!user.pro ? (
          <LockedFeature text="Get pro version to view and create sub decks" />
        ) : (
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
        )}
      </PagerView>

      <Button
        backgroundColor={defaultColors.activeColor}
        onPress={handleButtonPress}
        style={styles.newItemButton}
        isDisabled={getIsButtonDisabled(user.pro, isDeckMutating, activeTab)}
      >
        <ThemedText text={`Add new ${activeTab === 0 ? 'word' : 'deck'}`} />
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    marginTop: 5,
  },
  newItemButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
});

export default DecksAndWordsTabs;
