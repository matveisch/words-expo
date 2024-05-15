import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PieChart } from 'react-native-gifted-charts';

import DecksAndWordsTabs from '../components/DecksAndWordsTabs';
import { useWords } from '../hooks/useWords';
import { Word } from '../types/Word';
import { RootStackParamList } from './HomeView';
import Loader from '../components/Loader';
import { useDeck } from '../hooks/useDeck';
import { defaultColors, knowledgeColors } from '../helpers/colors';
import PressableArea from '../ui/PressableArea';
import ChartItem from '../ui/ChartItem';

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckView'> {}

function getCertainKnowledgeLevelWords(knowledgeLevel: number, words: Word[] | undefined): number {
  return words?.filter((word) => word.knowledgelevel === knowledgeLevel).length || 0;
}

function DeckView({ route, navigation }: Props) {
  const { currentDeckId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: words, isLoading: areWordsLoading } = useWords(currentDeckId);
  const { data: deck } = useDeck(currentDeckId);
  const graphData = [
    { value: getCertainKnowledgeLevelWords(1, words), color: knowledgeColors[0], text: 'again' },
    { value: getCertainKnowledgeLevelWords(2, words), color: knowledgeColors[1], text: 'hard' },
    { value: getCertainKnowledgeLevelWords(3, words), color: knowledgeColors[2], text: 'good' },
    { value: getCertainKnowledgeLevelWords(4, words), color: knowledgeColors[3], text: 'easy' },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerTitle: deck?.name,
    });
  }, [deck, navigation]);

  if (areWordsLoading || !words) {
    return <Loader />;
  }

  return (
    <View
      style={{
        height: '100%',
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingTop: 10,
      }}
    >
      {/*<View style={styles.buttonsContainer}>*/}
      {/*  <PressableArea style={styles.button} backgroundColor={knowledgeColors[0]}>*/}
      {/*    <Text*/}
      {/*      style={styles.buttonText}*/}
      {/*    >{`${getCertainKnowledgeLevelWords(1, words)}\n\nagain`}</Text>*/}
      {/*  </PressableArea>*/}

      {/*  <PressableArea style={styles.button} backgroundColor={knowledgeColors[1]}>*/}
      {/*    <Text*/}
      {/*      style={styles.buttonText}*/}
      {/*    >{`${getCertainKnowledgeLevelWords(2, words)}\n\nhard`}</Text>*/}
      {/*  </PressableArea>*/}

      {/*  <PressableArea style={styles.button} backgroundColor={knowledgeColors[2]}>*/}
      {/*    <Text*/}
      {/*      style={styles.buttonText}*/}
      {/*    >{`${getCertainKnowledgeLevelWords(3, words)}\n\ngood`}</Text>*/}
      {/*  </PressableArea>*/}

      {/*  <PressableArea style={styles.button} backgroundColor={knowledgeColors[3]}>*/}
      {/*    <Text*/}
      {/*      style={styles.buttonText}*/}
      {/*    >{`${getCertainKnowledgeLevelWords(4, words)}\n\neasy`}</Text>*/}
      {/*  </PressableArea>*/}
      {/*</View>*/}

      <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <PieChart
          donut
          shadow
          data={graphData}
          radius={90}
          innerRadius={80}
          centerLabelComponent={() => <Text style={{ fontSize: 70 }}>{words?.length}</Text>}
        />
        <View style={{ justifyContent: 'space-evenly' }}>
          {graphData.map(
            (level, index) =>
              level.value > 0 && (
                <ChartItem text={level.text} color={level.color} key={`${level.text}-${index}`} />
              )
          )}
        </View>
      </View>

      <View style={styles.studyButtonsContainer}>
        <PressableArea style={styles.studyButton} backgroundColor={defaultColors.activeColor}>
          <Text style={{ color: defaultColors.white, fontWeight: 700 }}>Study words</Text>
        </PressableArea>

        <PressableArea style={styles.studyButton} backgroundColor={defaultColors.activeColor}>
          <Text style={{ color: defaultColors.white, fontWeight: 700 }}>Revise words</Text>
        </PressableArea>
      </View>

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
    paddingHorizontal: 18,
  },
  buttonText: {
    textAlign: 'center',
  },
  studyButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  studyButton: {
    flex: 1,
  },
});

export default DeckView;
