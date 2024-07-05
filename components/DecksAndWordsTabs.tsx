import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View, Text } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { observer } from 'mobx-react-lite';
import { useIsMutating } from '@tanstack/react-query';

import { RootStackParamList } from '../views/home/HomeView';
import Button from '../ui/Button';
import { defaultColors } from '../helpers/colors';
import ThemedText from '../ui/ThemedText';
import { sessionStore } from '../features/sessionStore';
import useUser from '../hooks/useUser';
import Loader from './Loader';
import DecksTab from './DecksTab';
import WordsTab from './WordsTab';

type Props = {
  currentDeck: number;
  hasParentDeck: boolean;
};

function getIsButtonDisabled(userStatus: boolean, isDeckMutating: number, activeTab: number) {
  if (isDeckMutating !== 0) {
    return true;
  } else {
    if (activeTab === 0) {
      return false;
    } else return !userStatus;
  }
}

const DecksAndWordsTabs = observer((props: Props) => {
  const { currentDeck, hasParentDeck } = props;
  const [activeTab, setActiveTab] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: user } = useUser(sessionStore.session?.user.id || '');

  const pagerViewRef = useRef<PagerView | null>(null);
  const offset = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });
  const isDeckMutating = useIsMutating({ mutationKey: ['deleteDeck'] });

  function handleOffset(value: number) {
    offset.value = withSpring(value, {
      mass: 1,
      damping: 100,
      stiffness: 200,
    });
  }

  function handleButtonPress() {
    if (activeTab === 1) {
      navigation.navigate('DeckCreateModal', {
        parentDeckId: currentDeck,
      });
    } else {
      navigation.navigate('WordCreateModal', {
        parentDeckId: currentDeck,
      });
    }
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
    <View style={styles.container}>
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
          {!hasParentDeck && (
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
              width: !hasParentDeck ? 181.7 : 'auto',
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
        scrollEnabled={!hasParentDeck}
        onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
      >
        <WordsTab deckId={currentDeck} />
        <DecksTab deckId={currentDeck} />
      </PagerView>

      <Button
        backgroundColor={defaultColors.activeColor}
        onPress={handleButtonPress}
        style={styles.newItemButton}
        isDisabled={getIsButtonDisabled(user.pro, isDeckMutating, activeTab)}
      >
        <ThemedText text={`Add new ${activeTab === 0 ? 'word' : 'deck'}`} />
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    marginTop: 5,
  },
  newItemButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
});

export default DecksAndWordsTabs;
