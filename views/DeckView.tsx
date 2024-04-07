import { View, Text } from '@tamagui/core';
import { StyleSheet } from 'react-native';
import { Button, Progress } from 'tamagui';
import { useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DataContext, DataContextType } from '../helpers/DataContext';
import DecksAndWordsTabs from '../components/DecksAndWordsTabs';

export default function DeckView() {
  const insets = useSafeAreaInsets();
  const { currentDeck } = useContext(DataContext) as DataContextType;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        height: '100%',
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingTop: 10,
      }}
    >
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} backgroundColor="#F28F88">
          <Text
            style={styles.buttonText}
          >{`${currentDeck.numberOfCertainLevelWords(1)}\n\nagain`}</Text>
        </Button>
        <Button style={styles.button} backgroundColor="#F2DB88">
          <Text
            style={styles.buttonText}
          >{`${currentDeck.numberOfCertainLevelWords(2)}\n\nhard`}</Text>
        </Button>
        <Button style={styles.button} backgroundColor="#D7F288">
          <Text
            style={styles.buttonText}
          >{`${currentDeck.numberOfCertainLevelWords(3)}\n\ngood`}</Text>
        </Button>
        <Button style={styles.button} backgroundColor="#88F2F2">
          <Text
            style={styles.buttonText}
          >{`${currentDeck.numberOfCertainLevelWords(4)}\n\neasy`}</Text>
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
        <Progress
          value={(currentDeck.numberOfCertainLevelWords(4) * 100) / currentDeck.words.length}
        >
          <Progress.Indicator backgroundColor="#00CD5E" />
        </Progress>
      </View>

      <View>
        <Button>Study all the words</Button>
      </View>

      <DecksAndWordsTabs deck={currentDeck} />
    </View>
  );
}

const styles = StyleSheet.create({
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
