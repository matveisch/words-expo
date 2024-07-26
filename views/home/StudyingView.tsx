import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { RootStackParamList } from './HomeView';
import Loader from '../../components/Loader';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { defaultColors } from '../../helpers/colors';
import { TabBarIcon } from '../../ui/TabBarIcon';
import { WordType } from '../../types/WordType';
import FinishedSetBoard from '../../components/FinishedSetBoard';
import useUpdateWord, { WordToUpdate } from '../../hooks/useUpdateWord';
import { wordsLimitStore } from '../../features/wordsLimitStore';
import { autoCheckStore } from '../../features/autoCheckStore';
import ThemedText from '../../ui/ThemedText';
import { useDecks } from '../../hooks/useDecks';
import { sessionStore } from '../../features/sessionStore';
import { supabase } from '../../helpers/initSupabase';
import { UseMutateAsyncFunction } from '@tanstack/react-query';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Studying'> {}

export function wordCheck(word: WordType, answer: string) {
  return answer.toLowerCase().trim() === word.word.toLowerCase().trim();
}

async function getWords(deck_ids: number[], revise: boolean, words_limit: number) {
  let { data, error } = await supabase.rpc('limited_words', {
    deck_ids,
    revise,
    words_limit,
  });

  if (error) throw error;
  return data;
}

export const hasWordsToLearn = (
  words: WordType[] | null | undefined,
  currentIndex: number
): boolean => (words ? currentIndex + 1 < words.length : false);

export function getKnowledgeLevel(currentLevel: number, isAnswerRight: boolean) {
  if (isAnswerRight && currentLevel < 4) {
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

export const StudyingView = observer(({ route }: Props) => {
  const { deckId, revise } = route.params;

  const { data: decks } = useDecks(sessionStore.session?.user.id || '');
  const subDecks = decks?.filter((d) => d.parent_deck === deckId);
  const decksIds = [...(subDecks?.map((deck) => deck.id) || []), deckId];

  const [words, setWords] = useState<WordType[] | null>();

  useEffect(() => {
    getWords(decksIds, revise, wordsLimitStore.limit).then((words) => setWords(words));
  }, []);

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
});
