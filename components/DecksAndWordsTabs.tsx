import { FlashList } from '@shopify/flash-list';
import { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View, Text } from 'react-native';
import PagerView from 'react-native-pager-view';

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

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingBottom: 10,
          gap: 10,
        }}
      >
        <PressableArea
          style={{ flex: 1 }}
          outlined
          backgroundColor={activeTab === 0 ? undefined : defaultColors.grey}
          onPress={() => pagerViewRef.current?.setPage(0)}
        >
          <Text>Words</Text>
        </PressableArea>

        <PressableArea
          style={{ flex: 1 }}
          outlined
          backgroundColor={activeTab === 1 ? undefined : defaultColors.grey}
          onPress={() => pagerViewRef.current?.setPage(1)}
        >
          <Text>Decks</Text>
        </PressableArea>
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
        backgroundColor="hsl(24, 100%, 75.3%)"
        onPress={handleButtonPress}
        style={styles.newItemButton}
      >
        <Text>{`Add new ${activeTab === 0 ? 'word' : 'deck'}`}</Text>
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
