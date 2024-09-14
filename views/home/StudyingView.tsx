import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import FinishedSetBoard from '../../components/FinishedSetBoard';
import Loader from '../../components/Loader';
import { autoCheckStore } from '../../features/autoCheckStore';
import { wordsLimitStore } from '../../features/wordsLimitStore';
import { defaultColors } from '../../helpers/colors';
import { supabase } from '../../helpers/initSupabase';
import useUpdateWord, { WordToUpdate } from '../../hooks/useUpdateWord';
import { WordType } from '../../types/WordType';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { TabBarIcon } from '../../ui/TabBarIcon';
import ThemedText from '../../ui/ThemedText';
import { RootStackParamList } from './HomeLayout';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Studying'> {}

export function wordCheck(word: WordType, answer: string) {
  return answer.toLowerCase().trim() === word.word.toLowerCase().trim();
}

async function getWords(
  deckId: number,
  isParentDeck: boolean,
  revise: boolean,
  words_limit: number
) {
  let { data, error } = await supabase.rpc('get_random_words_from_deck', {
    deck_id: deckId,
    is_parent_deck: isParentDeck,
    words_limit: words_limit,
    revise: revise,
  });

  if (error) throw error;
  return data;
}

export const hasWordsToLearn = (
  words: WordType[] | null | undefined,
  currentIndex: number
): boolean => (words ? currentIndex + 1 < words.length : false);

export function getKnowledgeLevel(currentLevel: number, isAnswerRight: boolean) {
  if (isAnswerRight && currentLevel < 8) {
    return currentLevel + 1;
  } else if (!isAnswerRight && currentLevel > 1) {
    return currentLevel - 1;
  }
  return currentLevel;
}

export function handleAnswer(
  words: WordType[],
  autoCheck: boolean,
  currentIndex: number,
  answer: string,
  mutateAsync: UseMutateAsyncFunction<WordType, Error, WordToUpdate, unknown>,
  setBeingChecked: (checked: boolean) => void,
  setIsSuccess: (success: boolean) => void
) {
  Keyboard.dismiss();

  if (autoCheck) {
    const isAnswerRight = wordCheck(words[currentIndex], answer);
    const currentWord = words[currentIndex];

    const newKnowledgeLevel = getKnowledgeLevel(currentWord.knowledgelevel, isAnswerRight);

    mutateAsync({
      id: currentWord.id,
      knowledgelevel: newKnowledgeLevel,
    }).then(() => {
      setBeingChecked(true);
      setIsSuccess(isAnswerRight);
    });
  } else {
    setBeingChecked(true);
  }
}

export function handleNextWord(
  words: WordType[] | null | undefined,
  currentIndex: number,
  setBeingChecked: (checked: boolean) => void,
  setIsSuccess: (success: boolean) => void,
  setAnswer: (answer: string) => void,
  setCurrentIndex: (index: number) => void,
  setSetIsDone: (isDone: boolean) => void
) {
  setBeingChecked(false);
  setIsSuccess(false);
  setAnswer('');
  if (hasWordsToLearn(words, currentIndex)) {
    setCurrentIndex(currentIndex + 1);
  } else {
    setSetIsDone(true);
  }
}

export function iDontKnow(
  setBeingChecked: (checked: boolean) => void,
  words: WordType[],
  currentIndex: number,
  setIsSuccess: (success: boolean) => void,
  mutateAsync: UseMutateAsyncFunction<WordType, Error, WordToUpdate, unknown>
) {
  const currentWord = words[currentIndex];

  mutateAsync({
    id: currentWord.id,
    knowledgelevel: 1,
  }).then(() => {
    setBeingChecked(true);
    setIsSuccess(false);
  });
}

export const StudyingView = observer(({ route }: Props) => {
  const { deckId, revise, parentDeckId } = route.params;
  const isParentDeck = parentDeckId === null;
  const [words, setWords] = useState<WordType[] | null>();

  useEffect(() => {
    getWords(deckId, isParentDeck, revise, wordsLimitStore.limit).then((words) => setWords(words));
  }, [deckId]);

  const [answer, setAnswer] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [beingChecked, setBeingChecked] = useState<boolean>(false);
  const [setIsDone, setSetIsDone] = useState(false);
  const { mutateAsync, isPending } = useUpdateWord();

  function getBackgroundColor() {
    if (isSuccess) {
      return defaultColors.successColor;
    } else if (!isSuccess && beingChecked && autoCheckStore.autoCheck) {
      return defaultColors.errorColor;
    } else {
      return defaultColors.subColor;
    }
  }

  function handleAnswered(isCorrect: boolean) {
    const currentWord = words![currentIndex];
    const newKnowledgeLevel = getKnowledgeLevel(currentWord.knowledgelevel, isCorrect);

    mutateAsync({
      id: currentWord.id,
      knowledgelevel: newKnowledgeLevel,
    }).then(() => {
      handleNextWord(
        words,
        currentIndex,
        setBeingChecked,
        setIsSuccess,
        setAnswer,
        setCurrentIndex,
        setSetIsDone
      );
    });
  }

  if (!words) {
    return <Loader />;
  } else if (words.length === 0) {
    return (
      <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', fontSize: 20 }}>
          {`You have no new words to learn.\nRevise old ones or add some new!`}
        </Text>
      </View>
    );
  } else if (setIsDone) {
    return <FinishedSetBoard />;
  }

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.wordTitle}>{words[currentIndex].meaning}</Text>
        <View style={styles.explainedContainer}>
          {beingChecked && (
            <View style={styles.innerExplainedContainer}>
              {words[currentIndex].pronunciation && (
                <>
                  <Text style={styles.explainedText}>{words[currentIndex].pronunciation}</Text>
                  <View
                    style={{ width: 5, height: 5, backgroundColor: 'black', borderRadius: 50 }}
                  />
                </>
              )}
              <Text style={styles.explainedText}>{words[currentIndex].word}</Text>
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
            autoCorrect={false}
            autoComplete="off"
          />
          {!beingChecked && (
            <Button
              onPress={() =>
                handleAnswer(
                  words,
                  autoCheckStore.autoCheck,
                  currentIndex,
                  answer,
                  mutateAsync,
                  setBeingChecked,
                  setIsSuccess
                )
              }
              isDisabled={isPending}
            >
              {isPending ? <Loader /> : <TabBarIcon name="check" size={20} />}
            </Button>
          )}
        </View>

        {!beingChecked && (
          <Button
            style={styles.dontKnowButton}
            onPress={() =>
              iDontKnow(setBeingChecked, words, currentIndex, setIsSuccess, mutateAsync)
            }
            isDisabled={isPending}
          >
            <Text>I don't know</Text>
          </Button>
        )}

        <View style={styles.successButtons}>
          {!isSuccess && beingChecked && autoCheckStore.autoCheck && (
            <Button style={{ flex: 1 }} onPress={() => handleAnswered(true)} isDisabled={isPending}>
              <Text style={{ fontWeight: 500 }}>I answered right</Text>
            </Button>
          )}
          {beingChecked && !autoCheckStore.autoCheck && (
            <Button
              style={{ flex: 1 }}
              onPress={() => handleAnswered(false)}
              isDisabled={isPending}
            >
              <Text
                style={{
                  fontWeight: 500,
                  color: isPending ? defaultColors.white : undefined,
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
              onPress={() =>
                autoCheckStore.autoCheck
                  ? handleNextWord(
                      words,
                      currentIndex,
                      setBeingChecked,
                      setIsSuccess,
                      setAnswer,
                      setCurrentIndex,
                      setSetIsDone
                    )
                  : handleAnswered(true)
              }
              disabled={isPending}
            >
              <ThemedText text={!autoCheckStore.autoCheck ? 'I answered right' : 'Next word'} />
            </Button>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  wordTitle: {
    textAlign: 'center',
    fontSize: 40,
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
  dontKnowButton: {
    marginTop: 10,
  },
});
