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
import { Word } from '../types/Word';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Studying'> {}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const StudyingView = ({ route }: Props) => {
  const { deckId } = route.params;
  const { data: words } = useWords(deckId);
  const [wordsToLearn, setWordsToLearn] = useState<Word[] | undefined>(undefined);
  const [answer, setAnswer] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [beingChecked, setBeingChecked] = useState<boolean>(false);

  useEffect(() => {
    const notLearnedWords = words?.filter((word) => word.knowledgelevel < 4);
    if (notLearnedWords) {
      shuffleArray(notLearnedWords);
      setWordsToLearn(notLearnedWords);
    }
  }, []);

  function wordCheck(word: Word, answer: string) {
    return answer.toLowerCase().trim() === word.word.toLowerCase().trim();
  }

  function handleAnswer() {
    setBeingChecked(true);
    Keyboard.dismiss();

    if (wordsToLearn) {
      const isAnswerRight = wordCheck(wordsToLearn[currentIndex], answer);
      if (isAnswerRight) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    }
  }

  function handleNextWord() {
    setBeingChecked(false);
    setIsSuccess(false);
    setAnswer('');
    if (wordsToLearn && currentIndex + 1 < wordsToLearn.length) setCurrentIndex(currentIndex + 1);
  }

  function getBackgroundColor() {
    if (isSuccess) {
      return defaultColors.successColor;
    } else if (!isSuccess && beingChecked) {
      return defaultColors.errorColor;
    } else {
      return defaultColors.subColor;
    }
  }

  if (!words || !wordsToLearn) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.wordTitle}>{wordsToLearn[currentIndex].meaning}</Text>
      <View style={styles.explainedContainer}>
        {isSuccess && (
          <View style={styles.innerExplainedContainer}>
            <Text style={styles.explainedText}>{wordsToLearn[currentIndex].pronunciation}</Text>
            <View style={{ width: 5, height: 5, backgroundColor: 'black', borderRadius: 50 }} />
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
        />
        {!beingChecked && (
          <Button onPress={handleAnswer}>
            <TabBarIcon name="check" size={20} />
          </Button>
        )}
      </View>

      <View style={styles.successButtons}>
        {!isSuccess && beingChecked && (
          <Button style={{ flex: 1 }}>
            <Text style={{ fontWeight: 500 }}>I answered right</Text>
          </Button>
        )}
        {beingChecked && (
          <Button
            style={{ flex: 1 }}
            backgroundColor={defaultColors.activeColor}
            onPress={handleNextWord}
          >
            <Text style={{ color: defaultColors.white, fontWeight: 700 }}>Next word</Text>
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  wordTitle: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 30,
    marginTop: 50,
  },
  explainedContainer: {
    marginBottom: 50,
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
