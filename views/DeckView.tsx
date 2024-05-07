import { View, Text } from '@tamagui/core';
import { StyleSheet } from 'react-native';
import { Button, Progress } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DecksAndWordsTabs from '../components/DecksAndWordsTabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWords } from '../hooks/useWords';
import { Word } from '../types/Word';
import { RootStackParamList } from './Home';
import Loader from '../components/Loader';
import DeckUpdateModal from './DeckUpdateModal';
import { observer } from 'mobx-react';
import { deckModalStore } from '../helpers/DeckModalStore';
import { useEffect } from 'react';

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckView'> {}

function getCertainKnowledgeLevelWords(knowledgeLevel: number, words: Word[] | undefined): number {
  return words?.filter((word) => word.knowledgelevel === knowledgeLevel).length || 0;
}

function DeckView({ route }: Props) {
  const { currentDeckId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: words, isLoading: areWordsLoading } = useWords(currentDeckId);

  useEffect(() => {
    deckModalStore.setDeckId(currentDeckId);
  }, []);

  if (areWordsLoading) {
    return <Loader />;
  }

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
          >{`${getCertainKnowledgeLevelWords(1, words)}\n\nagain`}</Text>
        </Button>
        <Button style={styles.button} backgroundColor="#F2DB88">
          <Text
            style={styles.buttonText}
          >{`${getCertainKnowledgeLevelWords(2, words)}\n\nhard`}</Text>
        </Button>
        <Button style={styles.button} backgroundColor="#D7F288">
          <Text
            style={styles.buttonText}
          >{`${getCertainKnowledgeLevelWords(3, words)}\n\ngood`}</Text>
        </Button>
        <Button style={styles.button} backgroundColor="#88F2F2">
          <Text
            style={styles.buttonText}
          >{`${getCertainKnowledgeLevelWords(4, words)}\n\neasy`}</Text>
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
        {words && (
          <Progress value={(getCertainKnowledgeLevelWords(4, words) * 100) / words.length}>
            <Progress.Indicator backgroundColor="#00CD5E" />
          </Progress>
        )}
      </View>

      {/*<View>*/}
      {/*  <Button>Study all the words</Button>*/}
      {/*</View>*/}

      <DecksAndWordsTabs currentDeck={currentDeckId} />

      <DeckUpdateModal />
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

export default observer(DeckView);
