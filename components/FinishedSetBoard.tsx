import { View, StyleSheet, Text } from 'react-native';
import Button from '../ui/Button';
import { defaultColors } from '../helpers/colors';
import { useNavigation } from '@react-navigation/native';

export default function FinishedSetBoard() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You did it!</Text>
      <Text style={styles.subTitle}>You session is completed – you've learned new words!</Text>
      <Button
        backgroundColor={defaultColors.activeColor}
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: defaultColors.white, fontWeight: 700 }}>Back to the deck</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    height: '100%',
    alignItems: 'center',
    marginTop: 200,
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 20,
  },
  button: {
    marginTop: 20,
  },
});
