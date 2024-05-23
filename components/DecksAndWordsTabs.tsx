import { FlashList } from '@shopify/flash-list';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View, Text } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useWords } from '../hooks/useWords';
import { useSubDecks } from '../hooks/useSubDecks';
import { RootStackParamList } from '../views/HomeView';
import Button from '../ui/Button';
import ListItem from '../ui/ListItem';
import { defaultColors } from '../helpers/colors';
import { useIsMutating } from '@tanstack/react-query';
import ThemedText from '../ui/ThemedText';

type Props = {
  currentDeck: number;
  hasParentDeck: boolean;
};

const DecksAndWordsTabs = (props: Props) => {
  const { currentDeck, hasParentDeck } = props;
  const [activeTab, setActiveTab] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: subDecks, isFetched } = useSubDecks(currentDeck);
  const { data: words } = useWords(
    [...(subDecks?.map((deck) => deck.id) || []), currentDeck],
    isFetched
  );
  // @ts-ignore
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
        useNext
      >
        <View style={{ width: '100%', height: '100%' }} key="1">
          <FlashList
            estimatedItemSize={65}
            data={words}
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
          />
        </View>
        <View style={{ width: '100%', height: '100%' }} key="2">
          <FlashList
            estimatedItemSize={44}
            data={subDecks}
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No decks</Text>}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <ListItem
                backgroundColor={item.color ? item.color : undefined}
                title={item.name}
                onPress={() => {
                  navigation.push('DeckView', {
                    currentDeckId: item.id,
                    currentDeckName: item.name,
                    deckColor: item.color,
                  });
                }}
              />
            )}
          />
        </View>
      </PagerView>

      <Button
        backgroundColor={defaultColors.activeColor}
        onPress={handleButtonPress}
        style={styles.newItemButton}
        isDisabled={isDeckMutating !== 0}
      >
        <ThemedText text={`Add new ${activeTab === 0 ? 'word' : 'deck'}`} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
  },
  newItemButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
});

export default DecksAndWordsTabs;
