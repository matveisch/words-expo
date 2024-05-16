import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeView';
import { useWords } from '../hooks/useWords';
import { useState } from 'react';
import Loader from '../components/Loader';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { defaultColors } from '../helpers/colors';
import { TabBarIcon } from '../ui/TabBarIcon';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Studying'> {}

export const StudyingView = ({ route }: Props) => {
  const { deckId } = route.params;

  const { data: words } = useWords(deckId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!words) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.wordTitle}>{words[currentIndex].meaning}</Text>
      <View style={styles.explainedContainer}>
        {isSuccess && (
          <View style={styles.innerExplainedContainer}>
            <Text style={styles.explainedText}>{words[currentIndex].pronunciation}</Text>
            <View style={{ width: 5, height: 5, backgroundColor: 'black', borderRadius: 50 }} />
            <Text style={styles.explainedText}>{words[currentIndex].word}</Text>
          </View>
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Input placeholder="Enter word" style={{ flex: 1 }} />
        <Button
          onPress={() => {
            Keyboard.dismiss();
            setIsSuccess(!isSuccess);
          }}
        >
          <TabBarIcon name="check" size={20} />
        </Button>
      </View>
      {isSuccess && (
        <View style={styles.successButtons}>
          <Button style={{ flex: 1 }} backgroundColor={defaultColors.activeColor}>
            <Text style={{ color: defaultColors.white, fontWeight: 700 }}>I answered right</Text>
          </Button>
          <Button style={{ flex: 1 }} backgroundColor={defaultColors.activeColor}>
            <Text style={{ color: defaultColors.white, fontWeight: 700 }}>Next word</Text>
          </Button>
        </View>
      )}
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
