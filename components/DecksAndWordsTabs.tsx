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
import PressableArea from '../ui/PressableArea';
import ListItem from '../ui/ListItem';
import { defaultColors } from '../helpers/colors';

const DecksAndWordsTabs = ({ currentDeck }: { currentDeck: number }) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: words } = useWords(currentDeck);
  const { data: subDecks } = useSubDecks(currentDeck);
  const pagerViewRef = useRef<PagerView | null>(null);
  const offset = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  function handleOffset(value: number) {
    offset.value = withSpring(value);
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
          <PressableArea
            style={{ flex: 1 }}
            onPress={() => {
              handleOffset(0);
              pagerViewRef.current?.setPage(0);
            }}
            backgroundColor="transparent"
          >
            <Text>Words</Text>
          </PressableArea>
          <PressableArea
            style={{ flex: 1 }}
            onPress={() => {
              handleOffset(191.3);
              pagerViewRef.current?.setPage(1);
            }}
            backgroundColor="transparent"
          >
            <Text>Decks</Text>
          </PressableArea>
        </View>
        <Animated.View
          style={[
            {
              height: 5,
              width: 181.7,
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
        onPageScroll={(e) => setActiveTab(e.nativeEvent.position)}
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
                    wordId: item.id,
                    knowledgeLevel: item.knowledgelevel,
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

      <PressableArea
        backgroundColor={defaultColors.activeColor}
        onPress={handleButtonPress}
        style={styles.newItemButton}
      >
        <Text
          style={{ color: defaultColors.white, fontWeight: 700 }}
        >{`Add new ${activeTab === 0 ? 'word' : 'deck'}`}</Text>
      </PressableArea>
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
