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
import { RootStackParamList } from './home/HomeView';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useOfferings from '../hooks/useOfferings';

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
  const { data: currentOfferings } = useOfferings();

  const proVersion = currentOfferings?.availablePackages.find(
    (pack) => pack.presentedOfferingContext.offeringIdentifier === 'wordem-pro'
  );

  async function restore() {
    try {
      setIsPending(true);

      const restore = await Purchases.restorePurchases();
      if (restore.entitlements.active['WordEmPro'].isActive) {
        mutateAsync().then(() => {
          setIsPending(false);
          navigation.goBack();
        });
      }
    } catch (e) {
      setIsPending(false);
      console.error(e);
    } finally {
      setIsPending(false);
    }
  }

  async function subscribe() {
    try {
      setIsPending(true);

      if (
        currentOfferings !== null &&
        currentOfferings &&
        currentOfferings.availablePackages.length > 0
      ) {
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
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        {/*<Text*/}
        {/*  style={{*/}
        {/*    fontSize: 20,*/}
        {/*    textAlign: 'center',*/}
        {/*    marginBottom: 20,*/}
        {/*    color: defaultColors.activeColor,*/}
        {/*    fontWeight: 'bold',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Enjoy a Week Free Trial of WordEm Pro!*/}
        {/*</Text>*/}

        <View style={{ gap: 5 }}>
          {subscriptionItems.map((item, i) => (
            <SubscriptionItem
              text={item.text}
              subText={item.subText}
              icon={item.image}
              key={`${item.text}-${i}`}
            />
          ))}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <Text style={styles.detail}>Length of Subscription: </Text>
            <Text style={styles.value}>1 month, auto-renews monthly</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detail}>Free Trial: </Text>
            <Text style={styles.value}>1 week free</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detail}>Price After Free Trial: </Text>
            <Text style={styles.value}>
              {proVersion?.product.currencyCode} {proVersion?.product.price} per month
            </Text>
          </View>
        </View>

        <Button
          backgroundColor={defaultColors.activeColor}
          style={{ height: 50 }}
          onPress={subscribe}
        >
          {isPending ? (
            <ActivityIndicator />
          ) : (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 1,
                alignItems: 'center',
              }}
            >
              <ThemedText text="Try It Free" style={{ fontSize: 16 }} />
              <ThemedText
                text={`1 week free, then ${proVersion?.product.currencyCode} ${proVersion?.product.price}/month`}
                style={{
                  fontSize: 12,
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </View>
          )}
        </Button>

        <Button chromeless style={{ marginVertical: 5 }} onPress={restore}>
          {isPending ? <ActivityIndicator /> : <Text>Restore subscription</Text>}
        </Button>

        <Text style={styles.note}>
          After your 1-week free trial, you will be automatically billed{' '}
          {proVersion?.product.currencyCode} {proVersion?.product.price} per month. Cancel anytime
          in your account settings.
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 10,
  },
  detailsContainer: {
    borderStyle: 'solid',
    borderWidth: 3,
    borderRadius: 8,
    borderColor: defaultColors.disabledSecondaryButtonColor,
    marginVertical: 15,
    padding: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 13,
    color: '#333',
  },
  note: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});

export default SubscriptionOffer;
