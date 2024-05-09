import { View, Text } from '@tamagui/core';
import { StyleSheet } from 'react-native';
import { Button, Progress } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DecksAndWordsTabs from '../components/DecksAndWordsTabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWords } from '../hooks/useWords';
import { Word } from '../types/Word';
import { RootStackParamList } from './HomeView';
import Loader from '../components/Loader';
import { useEffect } from 'react';
import { useDeck } from '../hooks/useDeck';
import { knowledgeColors } from '../helpers/colors';

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckView'> {}

function getCertainKnowledgeLevelWords(knowledgeLevel: number, words: Word[] | undefined): number {
  return words?.filter((word) => word.knowledgelevel === knowledgeLevel).length || 0;
}

function DeckView({ route, navigation }: Props) {
  const { currentDeckId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: words, isLoading: areWordsLoading } = useWords(currentDeckId);
  const { data: deck } = useDeck(currentDeckId);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: deck?.name,
    });
  }, [deck?.name, navigation]);

  if (areWordsLoading) {
    return <Loader />;
  }

  return (
    <View
      style={{
        height: '100%',
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} backgroundColor={knowledgeColors[0]}>
          <Text
            style={styles.buttonText}
          >{`${getCertainKnowledgeLevelWords(1, words)}\n\nagain`}</Text>
        </Button>

        <Button style={styles.button} backgroundColor={knowledgeColors[1]}>
          <Text
            style={styles.buttonText}
          >{`${getCertainKnowledgeLevelWords(2, words)}\n\nhard`}</Text>
        </Button>

        <Button style={styles.button} backgroundColor={knowledgeColors[2]}>
          <Text
            style={styles.buttonText}
          >{`${getCertainKnowledgeLevelWords(3, words)}\n\ngood`}</Text>
        </Button>

        <Button style={styles.button} backgroundColor={knowledgeColors[3]}>
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

export default DeckView;
