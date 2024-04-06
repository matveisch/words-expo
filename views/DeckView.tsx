import { View, Text } from '@tamagui/core';
import { FlatList, StyleSheet } from 'react-native';
import Deck from '../helpers/Deck';
import { Button, ListItem, Progress, useWindowDimensions } from 'tamagui';
import DecksAndWordsTabs from './DecksAndWordsTabs';
import { ChevronRight } from '@tamagui/lucide-icons';
import { FlashList } from '@shopify/flash-list';
import Word from '../helpers/Word';

type DeckPropsType = {
  deck: Deck;
};

export default function DeckView({ deck }: DeckPropsType) {
  return (
    <View style={styles.container} height={'100%'}>
      <View>
        <Text style={styles.deckHeader} fontSize={20} paddingBottom={10}>
          {deck.name}
        </Text>

        <View style={styles.buttonsContainer}>
          <Button style={styles.button} backgroundColor="#F28F88">
            <Text style={styles.buttonText}>{`${deck.numberOfCertainLevelWords(1)}\n\nagain`}</Text>
          </Button>
          <Button style={styles.button} backgroundColor="#F2DB88">
            <Text style={styles.buttonText}>{`${deck.numberOfCertainLevelWords(2)}\n\nhard`}</Text>
          </Button>
          <Button style={styles.button} backgroundColor="#D7F288">
            <Text style={styles.buttonText}>{`${deck.numberOfCertainLevelWords(3)}\n\ngood`}</Text>
          </Button>
          <Button style={styles.button} backgroundColor="#88F2F2">
            <Text style={styles.buttonText}>{`${deck.numberOfCertainLevelWords(4)}\n\neasy`}</Text>
          </Button>
        </View>

        <View style={styles.studyButtonsContainer}>
          <Button style={styles.studyButton}>
            <Text>Study words</Text>
          </Button>
          <Button style={styles.studyButton}>
            <Text>Revise words</Text>
          </Button>
        </View>

        <View paddingVertical={10}>
          <Progress value={(deck.numberOfCertainLevelWords(4) * 100) / deck.words.length}>
            <Progress.Indicator backgroundColor="#00CD5E" />
          </Progress>
        </View>

        <View>
          <Button>Study all the words</Button>
        </View>
      </View>

      {/*<View style={{ borderWidth: 1, flex: 1 }}>*/}
      {/*  <FlashList*/}
      {/*    data={deck.words}*/}
      {/*    renderItem={({ item }: { item: Word }) => (*/}
      {/*      <ListItem*/}
      {/*        iconAfter={ChevronRight}*/}
      {/*        pressTheme*/}
      {/*        borderRadius={9}*/}
      {/*        title={item.word}*/}
      {/*        subTitle={item.meaning}*/}
      {/*      />*/}
      {/*    )}*/}
      {/*  />*/}
      {/*</View>*/}

      <View flex={1}>
        <DecksAndWordsTabs deck={deck} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // borderStyle: 'solid',
    // borderColor: 'black',
    // borderWidth: 1,
  },
  deckHeader: {},
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 10,
  },
  button: {
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
  },
  studyButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
  },
  studyButton: {
    // width: '100%',
    flex: 1,
  },
});
