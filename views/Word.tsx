import { Input, Label, Text, View } from 'tamagui';
import { Controller, useForm } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Home';
import useWord from '../hooks/useWord';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

type Inputs = {
  word: string;
  meaning: string;
  pronunciation: string;
};

interface Props extends NativeStackScreenProps<RootStackParamList, 'Word'> {}

export default function Word({ route }: Props) {
  const { wordId } = route.params;
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      word: '',
      meaning: '',
      pronunciation: '',
    },
  });
  const { data: word } = useWord(wordId);

  useEffect(() => {
    if (word) {
      setValue('word', word.word);
      setValue('meaning', word.meaning);
      setValue('pronunciation', word.pronunciation);
    }
  }, [word]);

  return (
    <View style={styles.container}>
      <Label>Word</Label>
      <Controller
        name="word"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onChangeText={(text) => onChange(text)}
            onBlur={onBlur}
            value={value}
            size="$4"
            borderWidth={2}
          />
        )}
      />
      {errors.word && <Text color="red">This field is required</Text>}

      <Label>Meaning</Label>
      <Controller
        name="meaning"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onChangeText={(text) => onChange(text)}
            onBlur={onBlur}
            value={value}
            size="$4"
            borderWidth={2}
          />
        )}
      />
      {errors.meaning && <Text color="red">This field is required</Text>}

      <Label>Pronunciation</Label>
      <Controller
        name="pronunciation"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onChangeText={(text) => onChange(text)}
            onBlur={onBlur}
            value={value}
            size="$4"
            borderWidth={2}
          />
        )}
      />
      {errors.pronunciation && <Text color="red">This field is required</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    padding: 10,
  },
});
