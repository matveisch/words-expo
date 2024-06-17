import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Purchases from 'react-native-purchases';
import { observer } from 'mobx-react';

import SubscriptionItem from '../components/SubscriptionItem';
import Button from '../ui/Button';
import ThemedText from '../ui/ThemedText';
import { defaultColors } from '../helpers/colors';
import { sessionStore } from '../features/sessionStore';
import useUpdateUser from '../hooks/useUpdateUser';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeView';
import { useState } from 'react';

const subscriptionItems = [
  {
    text: 'Unlimited Decks',
    subText: 'Build more than 2 decks to organize your learning better.',
    image: require('../assets/decks.png'),
  },
  {
    text: 'Sub-Decks',
    subText: 'Create sub-decks for more granular categorization.',
    image: require('../assets/folders.png'),
  },
  {
    text: 'Customizable Decks',
    subText: 'Change colors and themes for your decks.',
    image: require('../assets/color-palette-icon.png'),
  },
  {
    text: 'View Statistics',
    subText: 'Track your progress with detailed statistics.',
    image: require('../assets/chart.png'),
  },
  {
    text: 'Set Knowledge Level',
    subText: 'Adjust your learning based on your knowledge level.',
    image: require('../assets/slider-icon.png'),
  },
  {
    text: 'Additional Settings',
    subText: 'Turn off auto-check, manually mark answers, set words per session.',
    image: require('../assets/gear-icon.png'),
  },
];

interface Props extends NativeStackScreenProps<RootStackParamList, 'SubscriptionOffer'> {}

const SubscriptionOffer = observer(({ navigation }: Props) => {
  const [isPending, setIsPending] = useState(false);
  const { mutateAsync } = useUpdateUser(sessionStore.session?.user.id || '', true);

  async function subscribe() {
    try {
      setIsPending(true);

      const { current: currentOfferings } = await Purchases.getOfferings();
      if (currentOfferings !== null && currentOfferings.availablePackages.length > 0) {
        const proVersion = currentOfferings.availablePackages.find(
          (pack) => pack.presentedOfferingContext.offeringIdentifier === 'wordem-pro'
        );

        if (proVersion) {
          const { customerInfo } = await Purchases.purchasePackage(proVersion);

          if (typeof customerInfo.entitlements.active['WordEmPro'] !== 'undefined') {
            mutateAsync().then(() => {
              setIsPending(false);
              navigation.goBack();
            });
          } else {
            throw new Error('Subscription purchase failed.');
          }
        } else {
          throw new Error('Pro version package not found.');
        }
      } else {
        throw new Error('No available packages.');
      }
    } catch (e) {
      setIsPending(false);
      console.error('Subscription error:', e);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 20 }}>
        Upgrade to enhance your learning experience!
      </Text>

      <View>
        {subscriptionItems.map((item, i) => (
          <SubscriptionItem
            text={item.text}
            subText={item.subText}
            icon={item.image}
            key={`${item.text}-${i}`}
          />
        ))}
      </View>

      <Button
        backgroundColor={defaultColors.activeColor}
        style={{ height: 50, marginTop: 40 }}
        onPress={subscribe}
      >
        {isPending ? (
          <ActivityIndicator />
        ) : (
          <ThemedText text="Upgrade now" style={{ fontSize: 17 }} />
        )}
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 10,
  },
});

export default SubscriptionOffer;
