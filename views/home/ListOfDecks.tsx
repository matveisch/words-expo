import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import Animated, { SlideInRight } from 'react-native-reanimated';
import Purchases from 'react-native-purchases';

import { useDecks } from '../../hooks/useDecks';
import { RootStackParamList } from './HomeLayout';
import ListItem from '../../ui/ListItem';
import { sessionStore } from '../../features/sessionStore';
import LockedFeature from '../../components/LockedFeature';
import useUser from '../../hooks/useUser';
import ListItemSkeleton from '../../ui/ListItemSkeleton';
import useUpdateUser from '../../hooks/useUpdateUser';
import { secretCodeStore } from '../../features/secretCodeStore';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Decks'> {}

const ListOfDecks = observer(({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { data } = useDecks(sessionStore.session?.user.id || '');
  const decks = data?.filter((deck) => deck.parent_deck === null);
  const { data: user } = useUser(sessionStore.session?.user.id || '');
  const { mutate } = useUpdateUser(sessionStore.session?.user.id || '', false);

  useEffect(() => {
    async function getUserInfo() {
      try {
        const info = await Purchases.getCustomerInfo();
        if (
          typeof info.entitlements.active['WordEmPro'] === 'undefined' &&
          // @ts-ignore
          secretCodeStore.secretCode !== process.env.SECRET_CODE
        ) {
          mutate();
        }
      } catch (e) {
        console.error(e);
      }
    }

    getUserInfo();
  }, []);

  return (
    <Animated.View
      entering={SlideInRight}
      style={{
        height: '100%',
        paddingHorizontal: 10,
        // paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingTop: 10,
      }}
    >
      <View style={{ flex: 1 }}>
        {!decks && (
          <FlashList
            estimatedItemSize={59}
            showsVerticalScrollIndicator={false}
            renderItem={() => <ListItemSkeleton height={59} />}
            data={[...Array(8)]}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}
        {decks && (
          <FlashList
            estimatedItemSize={59}
            data={user?.pro ? decks : decks.slice(0, 2)}
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No decks</Text>}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={
              !user?.pro && decks?.length && decks.length > 1 ? (
                <View style={{ marginTop: 10 }}>
                  <LockedFeature text="Get pro version to view and create more than 2 decks" />
                </View>
              ) : undefined
            }
            renderItem={({ item }) => (
              <ListItem
                backgroundColor={item.color ? item.color : undefined}
                title={item.name}
                onPress={() => {
                  navigation.navigate('DeckView', {
                    deck: item,
                  });
                }}
              />
            )}
          />
        )}
      </View>
      <StatusBar style="auto" />
    </Animated.View>
  );
});

export default ListOfDecks;
