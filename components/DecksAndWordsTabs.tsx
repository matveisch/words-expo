import { Button, ListItem, Text } from 'tamagui';
import { View } from '@tamagui/core';
import { ChevronRight } from '@tamagui/lucide-icons';
import { FlashList } from '@shopify/flash-list';

import { useContext, useState } from 'react';
import { DataContext, DataContextType } from '../helpers/DataContext';

export default function DecksAndWordsTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const { currentDeck } = useContext(DataContext) as DataContextType;

  return (
    <View flexDirection="column" height="100%" flex={1} paddingTop={10}>
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
            data={currentDeck.words}
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
            data={currentDeck.innerDecks}
            ListEmptyComponent={<Text textAlign="center">No decks</Text>}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <ListItem iconAfter={ChevronRight} pressTheme borderRadius={9} title={item.name} />
            )}
          />
        </View>
      )}
    </View>
  );
}
