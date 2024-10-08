import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-root-toast';

import Loader from '../../components/Loader';
import LockedFeature from '../../components/LockedFeature';
import { sessionStore } from '../../features/sessionStore';
import { knowledgeColors } from '../../helpers/colors';
import { knowledgeLevels, namesOfKnowledgeLevels } from '../../helpers/consts';
import { getMinLevel, transformLevel } from '../../helpers/lib';
import { toastOptions } from '../../helpers/toastOptions';
import useAddWord from '../../hooks/useAddWord';
import useUser from '../../hooks/useUser';
import Button from '../../ui/Button';
import Circle from '../../ui/Circle';
import Description from '../../ui/Description';
import Input from '../../ui/Input';
import InputError from '../../ui/InputError';
import Label from '../../ui/Label';
import { RootStackParamList } from './HomeLayout';

type Inputs = {
  word: string;
  meaning: string;
  pronunciation: string;
  knowledgeLevel: number;
};

interface Props extends NativeStackScreenProps<RootStackParamList, 'WordCreateModal'> {}

const WordCreateModal = observer(({ route }: Props) => {
  const { deckId, parentDeckId } = route.params;
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const { mutateAsync, isPending } = useAddWord();
  const { data: user } = useUser(sessionStore.session?.user.id || '');

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
      deck: deckId,
      parent_deck: parentDeckId !== null ? parentDeckId : deckId,
    };

    mutateAsync(newWord).then(() => {
      Toast.show('Word Created', toastOptions);
      setCurrentLevel(1);
      reset();
      Keyboard.dismiss();
    });
  };

  if (!user) return <Loader />;

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Label text="Word" />
        <Controller
          name="word"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input onChangeText={(text) => onChange(text)} onBlur={onBlur} value={value} />
          )}
        />
        {errors.word && <InputError text="This field is required" />}

        <Label text="Meaning" />
        <Controller
          name="meaning"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input onChangeText={(text) => onChange(text)} onBlur={onBlur} value={value} />
          )}
        />
        {errors.meaning && <InputError text="This field is required" />}

        <Label text="Pronunciation" />
        <Controller
          name="pronunciation"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input onChangeText={(text) => onChange(text)} onBlur={onBlur} value={value} />
          )}
        />

        {!user.pro ? (
          <View style={{ marginTop: 10 }}>
            <LockedFeature text="Get pro version to set word knowledge level by yourself" />
          </View>
        ) : (
          <>
            <Label text="Knowledge Level" />
            <Description
              text="Although being calculated by the app, you can always define word knowledge level by
          yourself."
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {knowledgeLevels.map((level, index) => (
                <Circle
                  onPress={() => {
                    setCurrentLevel(getMinLevel(level));
                    setValue('knowledgeLevel', getMinLevel(level));
                  }}
                  key={`${level}-${index}`}
                  backgroundColor={knowledgeColors[index]}
                  borderColor={transformLevel(currentLevel) === level ? 'black' : undefined}
                  text={`${namesOfKnowledgeLevels[index]}`}
                />
              ))}
            </View>
          </>
        )}

        <Button onPress={handleSubmit(onSubmit)} isDisabled={isPending} style={{ marginTop: 20 }}>
          {isPending ? <Loader /> : <Text>Create</Text>}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
});

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
