import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import { useEffect, useRef, useState } from 'react';

import { RootStackParamList } from './HomeLayout';
import Button from '../../ui/Button';
import { defaultColors } from '../../helpers/colors';
import WordsTab from '../../components/WordsTab';
import DecksTab from '../../components/DecksTab';
import useUser from '../../hooks/useUser';
import { sessionStore } from '../../features/sessionStore';
import Loader from '../../components/Loader';

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckView'> {}

const DeckView = observer(({ route }: Props) => {
  const { deck } = route.params;
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState(0);
  const { data: user } = useUser(sessionStore.session?.user.id || '');

  const pagerViewRef = useRef<PagerView | null>(null);
  const offset = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  function handleOffset(value: number) {
    offset.value = withSpring(value, {
      mass: 1,
      damping: 100,
      stiffness: 200,
    });
  }

  useEffect(() => {
    if (activeTab === 0) {
      handleOffset(0);
    } else {
      handleOffset(191.3);
    }
  }, [activeTab]);

  if (!user) return <Loader />;

  return (
    <View
      style={{
        height: '100%',
        flexDirection: 'column',
        marginTop: 5,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
      }}
    >
      <View style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            style={{ flex: 1 }}
            onPress={() => {
              handleOffset(0);
              pagerViewRef.current?.setPage(0);
            }}
            backgroundColor="transparent"
          >
            <Text>Words</Text>
          </Button>
          {deck.parent_deck === null && (
            <Button
              style={{ flex: 1 }}
              onPress={() => {
                handleOffset(191.3);
                pagerViewRef.current?.setPage(1);
              }}
              backgroundColor="transparent"
            >
              <Text>Decks</Text>
            </Button>
          )}
        </View>
        <Animated.View
          style={[
            {
              height: 5,
              width: deck.parent_deck === null ? 181.7 : 'auto',
              backgroundColor: defaultColors.activeColor,
              borderRadius: 8,
            },
            animatedStyles,
          ]}
        />
      </View>

      <PagerView
        initialPage={0}
        style={{ flex: 1 }}
        ref={pagerViewRef}
        scrollEnabled={deck.parent_deck === null}
        onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
      >
        <WordsTab deckId={deck.id} parentDeckId={deck.parent_deck} />
        <DecksTab deckId={deck.id} />
      </PagerView>
    </View>
  );
});

export default DeckView;
