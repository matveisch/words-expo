import { View, StyleSheet, Text } from 'react-native';
import SubscriptionItem from '../components/SubscriptionItem';
import Button from '../ui/Button';
import ThemedText from '../ui/ThemedText';
import { defaultColors } from '../helpers/colors';

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

export default function SubscriptionOffer() {
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

      <Button backgroundColor={defaultColors.activeColor} style={{ height: 50, marginTop: 40 }}>
        <ThemedText text="Upgrade now" style={{ fontSize: 17 }} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 10,
  },
});
