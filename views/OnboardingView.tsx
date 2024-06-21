import { StyleSheet, Image, View, Text } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import React, { useState } from 'react';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

import { Auth } from '../components/Auth.native';
import Button from '../ui/Button';

export default function OnboardingView() {
  const [isDone, setIsDone] = useState(false);
  const insets = useSafeAreaInsets();

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
      {isDone && (
        <Animated.View
          entering={SlideInRight}
          style={[
            styles.authView,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
          ]}
        >
          <View style={{ gap: 20, alignItems: 'center' }}>
            <Image source={require('../assets/icon.png')} style={{ height: 125, width: 125 }} />
            <Text style={{ fontSize: 30 }}>Log in to continue</Text>
          </View>

          <View style={{ flex: 1 }} />

          <Auth />
          <View style={{ marginTop: 10, flexDirection: 'row', gap: 5 }}>
            <Button
              chromeless
              style={{ flex: 1 }}
              onPress={() => WebBrowser.openBrowserAsync('https://www.wordem.org/privacy')}
            >
              <Text>Privacy Policy</Text>
            </Button>

            <Button
              chromeless
              style={{ flex: 1 }}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'
                )
              }
            >
              <Text>Terms Of Use</Text>
            </Button>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { height: '100%' },
  image: { height: 200, width: 200 },
  authView: { padding: 10, alignItems: 'center', height: '100%' },
});
