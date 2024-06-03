import { StyleSheet, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import EmailForm from '../components/EmailForm';
import { useState } from 'react';
import Animated, { SlideInRight } from 'react-native-reanimated';

export default function OnboardingView() {
  const [isDone, setIsDone] = useState(false);

  const pages = [
    {
      backgroundColor: '#fff',
      title: 'Welcome to WordEm!',
      image: <Image source={require('../assets/icon.png')} style={styles.image} />,
      subtitle: 'Enhance your vocabulary and master new words effortlessly',
    },
    {
      backgroundColor: '#fff',
      title: 'Progress Tracking',
      image: <Image source={require('../assets/chart.png')} style={styles.image} />,
      subtitle: "Monitor your progress and see how much you've improved",
    },
    {
      backgroundColor: '#fff',
      title: 'Customizable Card Decks',
      image: <Image source={require('../assets/decks.png')} style={styles.image} />,
      subtitle: 'Personalize your learning by changing the color and name of your card decks',
    },
    {
      backgroundColor: '#fff',
      title: 'Statistics View',
      image: <Image source={require('../assets/pie-chart.png')} style={styles.image} />,
      subtitle:
        "Track your learning journey. See how many words you've learned and your knowledge level for unlearned words.",
    },
    {
      backgroundColor: '#fff',
      title: 'Start Learning Now',
      image: <Image source={require('../assets/rocket.png')} style={styles.image} />,
      subtitle: '',
    },
  ];

  return (
    <Animated.View style={styles.container} entering={SlideInRight}>
      {!isDone && (
        <Onboarding pages={pages} onDone={() => setIsDone(true)} onSkip={() => setIsDone(true)} />
      )}
      {isDone && <EmailForm />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { height: '100%' },
  image: { height: 200, width: 200 },
});
