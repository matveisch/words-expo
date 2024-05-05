import { Button, ListItem, Text } from 'tamagui';
import { View } from '@tamagui/core';
import { ChevronRight } from '@tamagui/lucide-icons';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWords } from '../hooks/useWords';
import { useSubDecks } from '../hooks/useSubDecks';
import { RootStackParamList } from '../views/Home';
import { StyleSheet } from 'react-native';
import { orange } from '@tamagui/colors';

export default function DecksAndWordsTabs({ currentDeck }: { currentDeck: number }) {
  const [activeTab, setActiveTab] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: words } = useWords(currentDeck);
  const { data: subDecks } = useSubDecks(currentDeck);

  return (
    <View flexDirection="column" height="100%" flex={1} style={styles.container}>
      <View flexDirection="row" gap={10} paddingBottom={10}>
        <Button
          flex={1}
          variant={activeTab === 0 ? 'outlined' : undefined}
          onPress={() => setActiveTab(0)}
        >
          <Text>Words</Text>
        </Button>
        <Button
          flex={1}
          variant={activeTab === 1 ? 'outlined' : undefined}
          onPress={() => setActiveTab(1)}
        >
          <Text>Decks</Text>
        </Button>
      </View>

      {activeTab === 0 && (
        <View flex={1}>
          <FlashList
            estimatedItemSize={65}
            data={words}
            ListEmptyComponent={<Text textAlign="center">No words</Text>}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <ListItem
                iconAfter={ChevronRight}
                pressTheme
                borderRadius={9}
                title={item.word}
                subTitle={item.meaning}
              />
            )}
          />
        </View>
      )}
      {activeTab === 1 && (
        <View flex={1}>
          <FlashList
            estimatedItemSize={44}
            data={subDecks}
            ListEmptyComponent={<Text textAlign="center">No decks</Text>}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <ListItem
                iconAfter={ChevronRight}
                pressTheme
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
      <View style={styles.newItemButton}>
        <Button backgroundColor={orange.orange7}>
          {`Add new ${activeTab === 0 ? 'word' : 'deck'}`}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  newItemButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
