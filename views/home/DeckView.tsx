import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import DecksAndWordsTabs from '../../components/DecksAndWordsTabs';
import { RootStackParamList } from './HomeView';

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckView'> {}

const DeckView = ({ route }: Props) => {
  const { deck } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        height: '100%',
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
      }}
    >
      <DecksAndWordsTabs currentDeck={deck.id} hasParentDeck={deck?.parent_deck !== null} />
    </View>
  );
};

export default DeckView;
