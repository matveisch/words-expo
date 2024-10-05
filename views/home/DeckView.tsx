import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import DecksTab from '../../components/DecksTab';
import Loader from '../../components/Loader';
import WordsTab from '../../components/WordsTab';
import { sessionStore } from '../../features/sessionStore';
import { defaultColors } from '../../helpers/colors';
import useUser from '../../hooks/useUser';
import Button from '../../ui/Button';
import { TabBarIcon } from '../../ui/TabBarIcon';
import { RootStackParamList } from './HomeLayout';

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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

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
      <View style={styles.header}>
        <Button chromeless size="small">
          <TabBarIcon name="arrow-left" />
        </Button>

        <Text>Deck Name</Text>

        <Button chromeless size="small" onPress={handlePresentModalPress}>
          <TabBarIcon name="ellipsis-v" />
        </Button>
      </View>
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

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default DeckView;
