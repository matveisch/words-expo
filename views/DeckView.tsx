import { View, Text } from '@tamagui/core';
import { StyleSheet, SafeAreaView } from 'react-native';
import Deck from '../helpers/Deck';
import { Button } from 'tamagui';

type DeckPropsType = {
  deck: Deck;
};

export default function DeckView({ deck }: DeckPropsType) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.deckHeader} fontSize={20} paddingBottom={10}>
          {deck.name}
        </Text>
        <View style={styles.buttonsContainer}>
          <Button style={styles.button}>
            <Text>{deck.numberOfCertainLevelWords(1)}</Text>
            <Text>again</Text>
          </Button>
          <Button>
            <Text
              justifyContent="center"
              alignItems="center"
            >{`${deck.numberOfCertainLevelWords(1)}\n\nagain`}</Text>
          </Button>
          <Button>
            <Text>{deck.numberOfCertainLevelWords(1)} again</Text>
          </Button>
          <Button>
            <Text>{deck.numberOfCertainLevelWords(1)} again</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
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
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
