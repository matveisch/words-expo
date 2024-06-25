import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import DecksAndWordsTabs from '../../components/DecksAndWordsTabs';
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
import { useWordsCount } from '../../hooks/useWordsCount';
import PieChart from '../../components/PieChart';

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckView'> {}

const DeckView = observer(({ route, navigation }: Props) => {
  const { deck } = route.params;
  const insets = useSafeAreaInsets();

  const { data: decks, isFetched } = useDecks(sessionStore.session?.user.id || '');
  const subDecks = decks?.filter((d) => d.parent_deck === deck.id);
  const decksIds = [...(subDecks?.map((deck) => deck.id) || []), deck.id];

  const { data: wordsCount } = useWordsCount(deck.id, decksIds, isFetched);
  const { data: againWordsCount } = useWordsCount(deck.id, decksIds, isFetched, 1);
  const { data: hardWordsCount } = useWordsCount(deck.id, decksIds, isFetched, 2);
  const { data: goodWordsCount } = useWordsCount(deck.id, decksIds, isFetched, 3);
  const { data: easyWordsCount } = useWordsCount(deck.id, decksIds, isFetched, 4);

  const graphData = [
    { value: againWordsCount || 0, color: knowledgeColors[0], text: 'again' },
    { value: hardWordsCount || 0, color: knowledgeColors[1], text: 'hard' },
    { value: goodWordsCount || 0, color: knowledgeColors[2], text: 'good' },
    { value: easyWordsCount || 0, color: knowledgeColors[3], text: 'easy' },
  ];

  const { data: user } = useUser(sessionStore.session?.user.id || '');
  const isDeckMutating = useIsMutating({ mutationKey: ['deleteDeck'] });

  if (!user) {
    return <Loader />;
  }

  return (
    <View
      style={{
        height: '100%',
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
      }}
    >
      {user.pro ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <PieChart graphData={graphData} total={wordsCount || 0} />

          <View style={{ justifyContent: 'space-evenly' }}>
            {graphData.map((level, index) => (
              <ChartItem text={level.text} color={level.color} key={`${level.text}-${index}`} />
            ))}
          </View>
        </View>
      ) : (
        <LockedFeature text="Get pro version to view statistics" />
      )}

      {wordsCount !== 0 && (
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

          {easyWordsCount !== 0 && (
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
