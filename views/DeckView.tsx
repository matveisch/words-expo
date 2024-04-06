import { View, Text } from '@tamagui/core';
import { StyleSheet } from 'react-native';
import Deck from '../helpers/Deck';
import { Button, Progress } from 'tamagui';
import DecksAndWordsTabs from '../components/DecksAndWordsTabs';

type DeckPropsType = {
  deck: Deck;
};

export default function DeckView({ deck }: DeckPropsType) {
  return (
    <View style={styles.container} height={'100%'}>
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

      <DecksAndWordsTabs deck={deck} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
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
    flex: 1,
  },
});
