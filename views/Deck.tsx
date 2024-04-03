import { View, Text } from '@tamagui/core';
import { StyleSheet, SafeAreaView } from 'react-native';

type DeckPropsType = {
  name: string;
};

export default function Deck(props: DeckPropsType) {
  const { name } = props;

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
