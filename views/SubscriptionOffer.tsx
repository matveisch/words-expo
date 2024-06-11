import { View, StyleSheet, Text } from 'react-native';
import SubscriptionItem from '../components/SubscriptionItem';

type Props = {};

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
    image: require('../assets/decks.png'),
  },
  {
    text: 'View Statistics',
    subText: 'Track your progress with detailed statistics.',
    image: require('../assets/chart.png'),
  },
  {
    text: 'Set Knowledge Level',
    subText: 'Adjust your learning based on your knowledge level.',
    image: require('../assets/decks.png'),
  },
  {
    text: 'Additional Settings',
    subText: 'Turn off auto-check, manually mark answers, set words per session.',
    image: require('../assets/decks.png'),
  },
];

export default function SubscriptionOffer(props: Props) {
  const {} = props;

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', gap: 20 }}>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>
          Upgrade to enhance your learning experience!
        </Text>
      </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
});
