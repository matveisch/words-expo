import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { RootStackParamList } from './HomeView';
import useWord from '../hooks/useWord';
import { knowledgeColors } from '../helpers/colors';
import { toastOptions } from '../helpers/toastOptions';
import useUpdateWord from '../hooks/useUpdateWord';
import Loader from '../components/Loader';
import Description from '../ui/Description';
import Label from '../ui/Label';
import Input from '../ui/Input';
import Circle from '../ui/Circle';
import Button from '../ui/Button';

type Inputs = {
  word: string;
  meaning: string;
  pronunciation: string;
  knowledgeLevel: number;
};

interface Props extends NativeStackScreenProps<RootStackParamList, 'Word'> {}

export default function Word({ route, navigation }: Props) {
  const { wordId } = route.params;
  const { data: word, isLoading } = useWord(wordId);
  const knowledgeLevels = [1, 2, 3, 4];
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      word: '',
      meaning: '',
      pronunciation: '',
      knowledgeLevel: 1,
    },
  });
  const updateWord = useUpdateWord();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const updatedWord = {
      word: data.word,
      meaning: data.meaning,
      pronunciation: data.pronunciation,
      knowledgelevel: data.knowledgeLevel,
      id: wordId,
    };

    updateWord.mutateAsync(updatedWord).then(() => {
      Toast.show('Word Updated', toastOptions);
    });

    Keyboard.dismiss();
  };

  useEffect(() => {
    if (word) {
      setValue('word', word.word);
      setValue('meaning', word.meaning);
      setValue('pronunciation', word.pronunciation);
      setCurrentLevel(word.knowledgelevel);
    }
  }, [word, word?.knowledgelevel]);

  useEffect(() => {
    if (word) {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: knowledgeColors[word.knowledgelevel - 1],
        },
      });
    }
  }, [word?.knowledgelevel, navigation]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Label text="Word" />
        <Controller
          name="word"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input onChangeText={(text) => onChange(text)} onBlur={onBlur} value={value} />
          )}
        />
        {errors.word && <Text style={{ color: 'red' }}>This field is required</Text>}

        <Label text="Meaning" />
        <Controller
          name="meaning"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input onChangeText={(text) => onChange(text)} onBlur={onBlur} value={value} />
          )}
        />
        {errors.meaning && <Text style={{ color: 'red' }}>This field is required</Text>}

        <Label text="Pronunciation" />
        <Controller
          name="pronunciation"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input onChangeText={(text) => onChange(text)} onBlur={onBlur} value={value} />
          )}
        />

        <Label text="Knowledge Level" />
        <Description
          text="Although being calculated by the app, you can always define word knowledge level by
          yourself."
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {knowledgeLevels.map((level, index) => (
            <Circle
              onPress={() => {
                setCurrentLevel(level);
                setValue('knowledgeLevel', level);
              }}
              text={`${level}`}
              key={`${level}-${index}`}
              backgroundColor={knowledgeColors[index]}
              borderColor={currentLevel === level ? 'black' : undefined}
            />
          ))}
        </View>

        <Button onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
          <Text>Edit</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 10,
  },
  knowledgeDescription: {
    marginTop: -10,
    marginBottom: 10,
    color: 'grey',
  },
});
