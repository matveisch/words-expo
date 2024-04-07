import { FlashList } from '@shopify/flash-list';
import { ListItem, Text } from 'tamagui';
import { View } from '@tamagui/core';
import { ChevronRight } from '@tamagui/lucide-icons';
import { useContext, useState } from 'react';
import { DataContext, DataContextType } from '../helpers/DataContext';

export default function ListOfSubDecks() {
  const { currentDeck, setCurrentDeck } = useContext(DataContext) as DataContextType;
  // const [currentSubDeck, setCurrentSubDeck] = useState<Deck>();

  return (
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
  );
}
