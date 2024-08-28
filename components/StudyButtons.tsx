import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useIsMutating } from '@tanstack/react-query';

import { RootStackParamList } from '../views/home/HomeLayout';
import { useDecks } from '../hooks/useDecks';
import { sessionStore } from '../features/sessionStore';
import { useWordsCount } from '../hooks/useWordsCount';
import { StyleSheet, View } from 'react-native';
import Button from '../ui/Button';
import { defaultColors } from '../helpers/colors';
import ThemedText from '../ui/ThemedText';

type Props = {
  deckId: number;
};

const StudyButtons = observer(({ deckId }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: decks, isFetched } = useDecks(sessionStore.session?.user.id || '');
  const subDecks = decks?.filter((d) => d.parent_deck === deckId);
  const decksIds = [...(subDecks?.map((deck) => deck.id) || []), deckId];

  const { data: wordsCount } = useWordsCount(deckId, decksIds, isFetched);
  const { data: easyWordsCount } = useWordsCount(deckId, decksIds, isFetched, 4);

  const isDeckMutating = useIsMutating({ mutationKey: ['deleteDeck'] });

  return (
    <View style={styles.studyButtonsContainer}>
      {wordsCount !== easyWordsCount && (
        <Button
          style={styles.studyButton}
          backgroundColor={defaultColors.activeColor}
          isDisabled={isDeckMutating !== 0}
          onPress={() =>
            navigation.navigate('Studying', {
              deckId: deckId,
              revise: false,
            })
          }
        >
          <ThemedText text="Study words" />
        </Button>
      )}

      {easyWordsCount !== 0 && (
        <Button
          style={styles.studyButton}
          backgroundColor={defaultColors.activeColor}
          isDisabled={isDeckMutating !== 0}
          onPress={() =>
            navigation.navigate('Studying', {
              deckId: deckId,
              revise: true,
            })
          }
        >
          <ThemedText text="Revise words" />
        </Button>
      )}
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

export default StudyButtons;
