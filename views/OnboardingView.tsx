import { View, StyleSheet, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

export default function OnboardingView() {
  const pages = [
    {
      backgroundColor: '#fff',
      title: 'Welcome to WordEm!',
      image: <Image source={require('../assets/icon.png')} style={{ height: 200, width: 200 }} />,
      subtitle: 'Enhance your vocabulary and master new words effortlessly',
    },
    {
      backgroundColor: '#fff',
      title: 'Progress Tracking',
      image: <Image source={require('../assets/chart.png')} style={{ height: 200, width: 200 }} />,
      subtitle: "Monitor your progress and see how much you've improved",
    },
    {
      backgroundColor: '#fff',
      title: 'Customizable Card Decks',
      image: <Image source={require('../assets/decks.png')} style={{ height: 200, width: 200 }} />,
      subtitle: 'Personalize your learning by changing the color and name of your card decks',
    },
    {
      backgroundColor: '#fff',
      title: 'Statistics View',
      image: (
        <Image source={require('../assets/pie-chart.png')} style={{ height: 200, width: 200 }} />
      ),
      subtitle:
        "Track your learning journey. See how many words you've learned and your knowledge level for unlearned words.",
    },
    {
      backgroundColor: '#fff',
      title: 'Start Learning Now',
      image: <Image source={require('../assets/rocket.png')} style={{ height: 200, width: 200 }} />,
      subtitle: '',
    },
  ];

  return (
    <View style={styles.container}>
      <Onboarding pages={pages} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: '100%' },
});
