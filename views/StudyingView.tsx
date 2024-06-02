import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeView';
import { useWords } from '../hooks/useWords';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { defaultColors } from '../helpers/colors';
import { TabBarIcon } from '../ui/TabBarIcon';
import { WordType } from '../types/WordType';
import FinishedSetBoard from '../components/FinishedSetBoard';
import useUpdateWord from '../hooks/useUpdateWord';
import { observer } from 'mobx-react';
import { wordsLimitStore } from '../features/wordsLimitStore';
import { autoCheckStore } from '../features/autoCheckStore';
import ThemedText from '../ui/ThemedText';
import { useDecks } from '../hooks/useDecks';
import { sessionStore } from '../features/sessionStore';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Studying'> {}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const StudyingView = observer(({ route }: Props) => {
  const { deckId, revise } = route.params;
  const { data: decks, isFetched } = useDecks(sessionStore.session?.user.id || '');
  const subDecks = decks?.filter((d) => d.parent_deck === deckId);
  const { data: words } = useWords(
    [...(subDecks?.map((deck) => deck.id) || []), deckId],
    isFetched
  );
  const [wordsToLearn, setWordsToLearn] = useState<WordType[] | undefined>(undefined);
  const [answer, setAnswer] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [beingChecked, setBeingChecked] = useState<boolean>(false);
  const [setIsDone, setSetIsDone] = useState(false);
  const updateWord = useUpdateWord();

  // 1. filtering words so only with knowledge level < 4 are shown
  // 2. shuffling them using the algorithm
  useEffect(() => {
    const notLearnedWords = words
      ?.filter((word) => (revise ? word.knowledgelevel === 4 : word.knowledgelevel < 4))
      .slice(0, wordsLimitStore.limit);
    if (notLearnedWords) {
      shuffleArray(notLearnedWords);
      setWordsToLearn(notLearnedWords);
    }
  }, []);

  function wordCheck(word: WordType, answer: string) {
    return answer.toLowerCase().trim() === word.word.toLowerCase().trim();
  }

  function handleAnswer() {
    Keyboard.dismiss();

    if (wordsToLearn && autoCheckStore.autoCheck) {
      const isAnswerRight = wordCheck(wordsToLearn[currentIndex], answer);
      const currentWord = wordsToLearn[currentIndex];

      if (isAnswerRight) {
        if (revise) {
          updateWord
            .mutateAsync({
              id: currentWord.id,
              knowledgelevel: currentWord.knowledgelevel + 1,
            })
            .then(() => {
              setBeingChecked(true);
              setIsSuccess(true);
            });
        }
      } else {
        if (currentWord.knowledgelevel > 1) {
          updateWord.mutateAsync({
            id: currentWord.id,
            knowledgelevel: currentWord.knowledgelevel - 1,
          });
        }
        setBeingChecked(true);
        setIsSuccess(false);
      }
    } else {
      setBeingChecked(true);
    }
  }

  const hasWordsToLearn = () => wordsToLearn && currentIndex + 1 < wordsToLearn.length;

  function handleNextWord() {
    setBeingChecked(false);
    setIsSuccess(false);
    setAnswer('');
    if (hasWordsToLearn()) setCurrentIndex(currentIndex + 1);
    if (!hasWordsToLearn()) setSetIsDone(true);
  }

  function getBackgroundColor() {
    if (isSuccess) {
      return defaultColors.successColor;
    } else if (!isSuccess && beingChecked && autoCheckStore.autoCheck) {
      return defaultColors.errorColor;
    } else {
      return defaultColors.subColor;
    }
  }

  function handleAnsweredRight() {
    const currentWord = wordsToLearn![currentIndex];
    if (currentWord.knowledgelevel < 4) {
      updateWord
        .mutateAsync({
          id: currentWord.id,
          knowledgelevel: currentWord.knowledgelevel + 1,
        })
        .then(() => {
          handleNextWord();
        });
    } else {
      handleNextWord();
    }
  }

  function handleAnsweredWrong() {
    const currentWord = wordsToLearn![currentIndex];
    if (currentWord.knowledgelevel > 1) {
      updateWord
        .mutateAsync({
          id: currentWord.id,
          knowledgelevel: currentWord.knowledgelevel - 1,
        })
        .then(() => {
          handleNextWord();
        });
    } else {
      handleNextWord();
    }
  }

  if (!words || !wordsToLearn) {
    return <Loader />;
  }

  if (setIsDone) {
    return <FinishedSetBoard />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.wordTitle}>{wordsToLearn[currentIndex].meaning}</Text>
      <View style={styles.explainedContainer}>
        {beingChecked && (
          <View style={styles.innerExplainedContainer}>
            {wordsToLearn[currentIndex].pronunciation && (
              <>
                <Text style={styles.explainedText}>{wordsToLearn[currentIndex].pronunciation}</Text>
                <View style={{ width: 5, height: 5, backgroundColor: 'black', borderRadius: 50 }} />
              </>
            )}
            <Text style={styles.explainedText}>{wordsToLearn[currentIndex].word}</Text>
          </View>
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Input
          placeholder="Enter word"
          style={{
            flex: 1,
            backgroundColor: getBackgroundColor(),
          }}
          onChangeText={setAnswer}
          value={answer}
          editable={!beingChecked}
          selectTextOnFocus={!beingChecked}
          autoFocus
        />
        {!beingChecked && (
          <Button onPress={handleAnswer} isDisabled={updateWord.isPending}>
            <TabBarIcon name="check" size={20} />
          </Button>
        )}
      </View>

      <View style={styles.successButtons}>
        {!isSuccess && beingChecked && autoCheckStore.autoCheck && (
          <Button
            style={{ flex: 1 }}
            onPress={handleAnsweredRight}
            isDisabled={updateWord.isPending}
          >
            <Text style={{ fontWeight: 500 }}>I answered right</Text>
          </Button>
        )}
        {beingChecked && !autoCheckStore.autoCheck && (
          <Button
            style={{ flex: 1 }}
            onPress={handleAnsweredWrong}
            isDisabled={updateWord.isPending}
          >
            <Text
              style={{
                fontWeight: 500,
                color: updateWord.isPending ? defaultColors.white : undefined,
              }}
            >
              I answered wrong
            </Text>
          </Button>
        )}
        {beingChecked && (
          <Button
            style={{ flex: 1 }}
            backgroundColor={defaultColors.activeColor}
            onPress={autoCheckStore.autoCheck ? handleNextWord : handleAnsweredRight}
            disabled={updateWord.isPending}
          >
            <ThemedText text={!autoCheckStore.autoCheck ? 'I answered right' : 'Next word'} />
          </Button>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  wordTitle: {
    textAlign: 'center',
    fontSize: 50,
    marginTop: 50,
  },
  explainedContainer: {
    marginBottom: 80,
    marginTop: 10,
    height: 24,
  },
  innerExplainedContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explainedText: {
    fontSize: 20,
  },
  successButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
});
