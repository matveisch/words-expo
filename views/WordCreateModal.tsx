import { observer } from 'mobx-react';
import { Button, Circle, H3, Input, Label, Sheet, SizableText, Text, View } from 'tamagui';
import { wordModalStore } from '../features/WordModalStore';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { knowledgeColors } from '../helpers/colors';
import { Keyboard, StyleSheet } from 'react-native';
import useAddWord from '../hooks/useAddWord';
import Toast from 'react-native-root-toast';
import { toastOptions } from '../helpers/toastOptions';
import { currentDeckStore } from '../features/CurrentDeckStore';

type Inputs = {
  word: string;
  meaning: string;
  pronunciation: string;
  knowledgeLevel: number;
};

const WordCreateModal = observer(() => {
  const knowledgeLevels = [1, 2, 3, 4];
  const [currentLevel, setCurrentLevel] = useState<number>(1);
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
  const addWord = useAddWord();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (currentDeckStore.currentDeck) {
      const newWord = {
        word: data.word,
        meaning: data.meaning,
        pronunciation: data.pronunciation,
        knowledgelevel: data.knowledgeLevel,
        deck: currentDeckStore.currentDeck,
      };

      addWord.mutateAsync(newWord).then(() => {
        Toast.show('Word Created', toastOptions);
        setCurrentLevel(1);
        reset();
      });

      Keyboard.dismiss();
      wordModalStore.setIsWordModalOpen(false);
    }
  };

  return (
    <Sheet
      modal
      forceRemoveScrollEnabled={wordModalStore.isWordModalOpen}
      open={wordModalStore.isWordModalOpen}
      onOpenChange={(state: boolean) => {
        wordModalStore.setIsWordModalOpen(state);
        setCurrentLevel(1);
        reset();
      }}
      dismissOnSnapToBottom
      zIndex={100_000}
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding={10}>
        <View>
          <H3 textAlign="center">New Word</H3>

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
            Create
          </Button>
        </View>
      </Sheet.Frame>
    </Sheet>
  );
});

const styles = StyleSheet.create({
  container: {
    // height: '100%',
    // padding: 10,
  },
  knowledgeDescription: {
    marginTop: -10,
    marginBottom: 10,
    color: 'grey',
  },
});

export default WordCreateModal;
