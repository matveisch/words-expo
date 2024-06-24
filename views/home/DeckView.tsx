import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PieChart } from 'react-native-gifted-charts';

import DecksAndWordsTabs from '../../components/DecksAndWordsTabs';
import { useWords } from '../../hooks/useWords';
import { WordType } from '../../types/WordType';
import { RootStackParamList } from './HomeView';
import Loader from '../../components/Loader';
import { defaultColors, knowledgeColors } from '../../helpers/colors';
import Button from '../../ui/Button';
import ChartItem from '../../ui/ChartItem';
import { useIsMutating } from '@tanstack/react-query';
import ThemedText from '../../ui/ThemedText';
import { useDecks } from '../../hooks/useDecks';
import { observer } from 'mobx-react';
import { sessionStore } from '../../features/sessionStore';
import useUser from '../../hooks/useUser';
import LockedFeature from '../../components/LockedFeature';

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckView'> {}

function getCertainKnowledgeLevelWords(
  knowledgeLevel: number,
  words: WordType[] | undefined
): number {
  return words?.filter((word) => word.knowledgelevel === knowledgeLevel).length || 0;
}

const DeckView = observer(({ route, navigation }: Props) => {
  const { deck } = route.params;
  const insets = useSafeAreaInsets();

  const { data: decks, isFetched } = useDecks(sessionStore.session?.user.id || '');
  const subDecks = decks?.filter((d) => d.parent_deck === deck.id);

  const { data: words, isLoading: areWordsLoading } = useWords(
    [...(subDecks?.map((deck) => deck.id) || []), deck.id],
    isFetched
  );
  const { data: user } = useUser(sessionStore.session?.user.id || '');
  const isDeckMutating = useIsMutating({ mutationKey: ['deleteDeck'] });
  const graphData = [
    { value: getCertainKnowledgeLevelWords(1, words), color: knowledgeColors[0], text: 'again' },
    { value: getCertainKnowledgeLevelWords(2, words), color: knowledgeColors[1], text: 'hard' },
    { value: getCertainKnowledgeLevelWords(3, words), color: knowledgeColors[2], text: 'good' },
    { value: getCertainKnowledgeLevelWords(4, words), color: knowledgeColors[3], text: 'easy' },
  ];

  if (areWordsLoading || !words || !user) {
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
      {user.pro ? (
        words.length > 0 && (
          <View
            style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <PieChart
              donut
              data={graphData}
              radius={90}
              innerRadius={80}
              centerLabelComponent={() => <Text style={{ fontSize: 70 }}>{words?.length}</Text>}
            />
            <View style={{ justifyContent: 'space-evenly' }}>
              {graphData.map(
                (level, index) =>
                  level.value > 0 && (
                    <ChartItem
                      text={level.text}
                      color={level.color}
                      key={`${level.text}-${index}`}
                    />
                  )
              )}
            </View>
          </View>
        )
      ) : (
        <LockedFeature text="Get pro version to view statistics" />
      )}

      {words.length !== 0 && (
        <View style={styles.studyButtonsContainer}>
          <Button
            style={styles.studyButton}
            backgroundColor={defaultColors.activeColor}
            isDisabled={isDeckMutating !== 0}
            onPress={() =>
              navigation.navigate('Studying', {
                deckId: deck.id,
                revise: false,
              })
            }
          >
            <ThemedText text="Study words" />
          </Button>

          {getCertainKnowledgeLevelWords(4, words) !== 0 && (
            <Button
              style={styles.studyButton}
              backgroundColor={defaultColors.activeColor}
              isDisabled={isDeckMutating !== 0}
              onPress={() =>
                navigation.navigate('Studying', {
                  deckId: deck.id,
                  revise: true,
                })
              }
            >
              <ThemedText text="Revise words" />
            </Button>
          )}
        </View>
      )}

      <DecksAndWordsTabs currentDeck={deck.id} hasParentDeck={deck?.parent_deck !== null} />
    </View>
  );
});

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
