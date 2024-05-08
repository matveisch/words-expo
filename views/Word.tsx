import { Button, Circle, Input, Label, SizableText, Text, View } from 'tamagui';
import { Controller, useForm } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './Home';
import useWord from '../hooks/useWord';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { knowledgeColors } from '../helpers/colors';

type Inputs = {
  word: string;
  meaning: string;
  pronunciation: string;
};

interface Props extends NativeStackScreenProps<RootStackParamList, 'Word'> {}

export default function Word({ route }: Props) {
  const { wordId } = route.params;
  const { data: word } = useWord(wordId);
  const knowledgeLevels = [1, 2, 3, 4];
  const [currentLevel, setCurrentLevel] = useState<number>(1);
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

  useEffect(() => {
    if (word) {
      setValue('word', word.word);
      setValue('meaning', word.meaning);
      setValue('pronunciation', word.pronunciation);
      setCurrentLevel(word.knowledgelevel);
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

      <Label>Knowledge Level</Label>
      <SizableText size="$3" style={styles.knowledgeDescription}>
        You can always define word knowledge level by yourself
      </SizableText>
      <View flexDirection="row" gap={10}>
        {knowledgeLevels.map((level, index) => (
          <Circle
            onPress={() => {
              setCurrentLevel(level);
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

      <Button marginTop={20}>Edit</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    padding: 10,
  },
  knowledgeDescription: {
    marginTop: -10,
    marginBottom: 10,
    color: 'grey',
  },
});
