import { ListItem, SizableText, Tabs } from 'tamagui';
import { View } from '@tamagui/core';
import { FlatList } from 'react-native';
import { ChevronRight } from '@tamagui/lucide-icons';
import Deck from '../helpers/Deck';

export default function DecksAndWordsTabs({ deck }: { deck: Deck }) {
  return (
    <Tabs defaultValue="tab1" flexDirection="column" height="100%" flex={1}>
      <Tabs.List marginVertical={10}>
        <Tabs.Tab value="tab1" flex={1}>
          <SizableText>Words</SizableText>
        </Tabs.Tab>
        <Tabs.Tab value="tab2" flex={1}>
          <SizableText>Decks</SizableText>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Content value="tab1" flex={1}>
        <FlatList
          data={deck.words}
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
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <FlatList
          data={deck.innerDecks}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <ListItem iconAfter={ChevronRight} pressTheme borderRadius={9} title={item.name} />
          )}
        />
      </Tabs.Content>
    </Tabs>
  );
}
