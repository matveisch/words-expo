import { View, Text } from '@tamagui/core';
import { StyleSheet, SafeAreaView } from 'react-native';
import Word from '../helpers/Word';
import Deck from '../helpers/Deck';

type DeckPropsType = {
  name: string;
};

export default function DeckView(props: DeckPropsType) {
  const { name } = props;

  const dogWord = new Word('dog', 'собака', 'дог', 4);
  const catWord = new Word('cat', 'кошка', 'кэт', 3);
  const newDeck = new Deck([dogWord, catWord]);
  const otherDeck = new Deck([dogWord, catWord], [newDeck]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.deckHeader}>{name}</Text>
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
  deckHeader: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
  },
});
