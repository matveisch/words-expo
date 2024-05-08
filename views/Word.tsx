import { Button, Circle, Input, Label, SizableText, Text, View } from 'tamagui';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Home';
import useWord from '../hooks/useWord';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import { knowledgeColors } from '../helpers/colors';
import Toast from 'react-native-root-toast';
import { toastOptions } from '../helpers/toastOptions';
import useUpdateWord from '../hooks/useUpdateWord';
import Loader from '../components/Loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  }, [word]);

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

        <Label>Knowledge Level</Label>
        <SizableText size="$3" style={styles.knowledgeDescription}>
          Although being calculated by the app, you can always define word knowledge level by
          yourself.
        </SizableText>
        <View flexDirection="row" gap={10}>
          {knowledgeLevels.map((level, index) => (
            <Circle
              onPress={() => {
                setCurrentLevel(level);
                setValue('knowledgeLevel', level);
              }}
              key={`${level}-${index}`}
              backgroundColor={knowledgeColors[index]}
              size="$3"
              borderWidth={3}
              borderColor={currentLevel === level ? 'black' : '$borderColor'}
            >
              <Text>{level}</Text>
            </Circle>
          ))}
        </View>

        <Button marginTop={20} onPress={handleSubmit(onSubmit)}>
          Edit
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
