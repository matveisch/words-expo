import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useIsMutating } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';

import { StyleSheet, View } from 'react-native';
import { defaultColors } from '../helpers/colors';
import { useWordsCount } from '../hooks/useWordsCount';
import Button from '../ui/Button';
import ThemedText from '../ui/ThemedText';
import { RootStackParamList } from '../views/home/HomeLayout';

type Props = {
  deckId: number;
  parentDeckId: number | null;
};

const StudyButtons = observer(({ deckId, parentDeckId }: Props) => {
  const isParentDeck = parentDeckId === null;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: counts, error } = useWordsCount(deckId, isParentDeck);
  const isDeckMutating = useIsMutating({ mutationKey: ['deleteDeck'] });

  return (
    <View style={styles.studyButtonsContainer}>
      {counts[0] !== counts[7] + counts[8] && (
        <Button
          style={styles.studyButton}
          backgroundColor={defaultColors.activeColor}
          isDisabled={isDeckMutating !== 0}
          onPress={() =>
            navigation.navigate('Studying', {
              deckId: deckId,
              parentDeckId: parentDeckId,
              revise: false,
            })
          }
        >
          <ThemedText text="Study words" />
        </Button>
      )}

      {counts[7] + counts[8] !== 0 && (
        <Button
          style={styles.studyButton}
          backgroundColor={defaultColors.activeColor}
          isDisabled={isDeckMutating !== 0}
          onPress={() =>
            navigation.navigate('Studying', {
              deckId: deckId,
              parentDeckId: parentDeckId,
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
