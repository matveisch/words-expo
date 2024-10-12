import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import DecksTab from '../../components/DecksTab';
import Loader from '../../components/Loader';
import WordsTab from '../../components/WordsTab';
import { sessionStore } from '../../features/sessionStore';
import { defaultColors } from '../../helpers/colors';
import useDeleteDeck from '../../hooks/useDeleteDeck';
import useUser from '../../hooks/useUser';
import Button from '../../ui/Button';
import { TabBarIcon } from '../../ui/TabBarIcon';
import { RootStackParamList } from './HomeLayout';

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckView'> {}

const DeckView = observer(({ route }: Props) => {
  const { deck } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // bottom sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%'], []);
  const [sheetIndex, setSheetIndex] = useState(-1);

  const [activeTab, setActiveTab] = useState(0);
  const { data: user } = useUser(sessionStore.session?.user.id || '');
  const { mutateAsync: deleteDeck, isPending: deckIsBeingDeleted } = useDeleteDeck();
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

  function handleDeleteDeck(deckId: number) {
    Alert.alert('Are you sure?', 'All of your sub decks are about to be deleted as well', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          deleteDeck(deckId).then(() => navigation.goBack());
        },
      },
    ]);
  }

  useEffect(() => {
    if (activeTab === 0) {
      handleOffset(0);
    } else {
      handleOffset(191.3);
    }
  }, [activeTab]);

  function handlePresentModalPress() {
    if (sheetIndex === -1) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }

  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index);
  }, []);

  if (!user) return <Loader />;

  return (
    <View
      style={{
        height: '100%',
        flexDirection: 'column',
        paddingTop: insets.top,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
      }}
    >
      {/* navigation bar */}
      <View style={styles.header}>
        <Button chromeless onPress={() => navigation.goBack()}>
          <TabBarIcon name="arrow-left" />
        </Button>
        <Button chromeless onPress={handlePresentModalPress}>
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
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Button
            style={styles.sheetButton}
            disabled={deckIsBeingDeleted}
            onPress={() => {
              bottomSheetModalRef.current?.dismiss();
              navigation.navigate('DeckUpdateModal', {
                deck: route.params.deck,
              });
            }}
          >
            <Text>Edit</Text>
          </Button>
          <Button style={styles.sheetButton} disabled={deckIsBeingDeleted}>
            <Text>Export</Text>
          </Button>
          <Button
            style={[styles.sheetButton, { backgroundColor: defaultColors.errorColor }]}
            disabled={deckIsBeingDeleted}
            onPress={() => handleDeleteDeck(route.params.deck.id)}
          >
            <Text>Delete</Text>
          </Button>
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
    gap: 10,
    padding: 10,
  },
  sheetButton: {},
});

export default DeckView;
