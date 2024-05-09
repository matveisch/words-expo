import { ListItem } from 'tamagui';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View, Text } from 'react-native';

import { useWords } from '../hooks/useWords';
import { useSubDecks } from '../hooks/useSubDecks';
import { RootStackParamList } from '../views/HomeView';
import { ChevronIcon } from '../ui/ChevronIcon';
import PressableArea from '../ui/PressableArea';

const DecksAndWordsTabs = ({ currentDeck }: { currentDeck: number }) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: words } = useWords(currentDeck);
  const { data: subDecks } = useSubDecks(currentDeck);

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
      <View style={{ flexDirection: 'row', gap: 10, paddingBottom: 10 }}>
        <PressableArea
          style={{ flex: 1 }}
          outlined={activeTab === 0}
          onPress={() => setActiveTab(0)}
        >
          <Text>Words</Text>
        </PressableArea>

        <PressableArea
          style={{ flex: 1 }}
          outlined={activeTab === 1}
          onPress={() => setActiveTab(1)}
        >
          <Text>Decks</Text>
        </PressableArea>
      </View>

      {activeTab === 0 && (
        <View style={{ flex: 1 }}>
          <FlashList
            estimatedItemSize={65}
            data={words}
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No words</Text>}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <ListItem
                iconAfter={ChevronIcon}
                pressTheme
                borderRadius={9}
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
      )}

      {activeTab === 1 && (
        <View style={{ flex: 1 }}>
          <FlashList
            estimatedItemSize={44}
            data={subDecks}
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No decks</Text>}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <ListItem
                iconAfter={ChevronIcon}
                pressTheme
                backgroundColor={item.color ? item.color : undefined}
                borderRadius={9}
                title={item.name}
                onPress={() => {
                  navigation.push('DeckView', {
                    currentDeckId: item.id,
                    currentDeckName: item.name,
                  });
                }}
              />
            )}
          />
        </View>
      )}
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
