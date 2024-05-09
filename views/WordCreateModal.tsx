import { Button, Circle, Input, Label, SizableText, Text, View } from 'tamagui';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { knowledgeColors } from '../helpers/colors';
import { Keyboard, StyleSheet } from 'react-native';
import useAddWord from '../hooks/useAddWord';
import Toast from 'react-native-root-toast';
import { toastOptions } from '../helpers/toastOptions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeView';

type Inputs = {
  word: string;
  meaning: string;
  pronunciation: string;
  knowledgeLevel: number;
};

interface Props extends NativeStackScreenProps<RootStackParamList, 'WordCreateModal'> {}

const WordCreateModal = ({ route, navigation }: Props) => {
  const { parentDeckId } = route.params;
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const { mutateAsync, isPending } = useAddWord();
  const knowledgeLevels = [1, 2, 3, 4];

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      word: '',
      meaning: '',
      pronunciation: '',
      knowledgeLevel: 1,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const newWord = {
      word: data.word,
      meaning: data.meaning,
      pronunciation: data.pronunciation,
      knowledgelevel: data.knowledgeLevel,
      deck: parentDeckId,
    };

    mutateAsync(newWord).then(() => {
      Toast.show('Word Created', toastOptions);
      setCurrentLevel(1);
      reset();
      Keyboard.dismiss();
      navigation.goBack();
    });
  };

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

        <Button marginTop={20} onPress={handleSubmit(onSubmit)} disabled={isPending}>
          Create
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  knowledgeDescription: {
    marginTop: -10,
    marginBottom: 10,
    color: 'grey',
  },
});

export default WordCreateModal;
