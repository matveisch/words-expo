import { Button, Circle, Input, Label, Text } from 'tamagui';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard, StyleSheet, View } from 'react-native';

import useAddDeck from '../hooks/useAddDeck';
import { colors } from '../helpers/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeView';

type Inputs = {
  deckName: string;
  color: string;
};

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckCreateModal'> {}

const DeckCreateModal = ({ navigation, route }: Props) => {
  const [currentColor, setCurrentColor] = useState('');
  const { mutateAsync, isPending } = useAddDeck();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      deckName: '',
      color: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const newDeck = {
      name: data.deckName,
      parent_deck: route.params ? route.params.parentDeckId : null,
      color: data.color,
    };

    mutateAsync(newDeck).then(() => {
      reset();
      Keyboard.dismiss();
      setCurrentColor('');
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      <Label>Name</Label>
      <Controller
        name="deckName"
        control={control}
        rules={{
          required: true,
        }}
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
      {errors.deckName && <Text color="red">This field is required</Text>}

      <Label>Color</Label>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {colors.map((color, index) => (
          <Circle
            onPress={() => {
              setValue('color', color);
              setCurrentColor(color);
            }}
            key={`${color}-${index}`}
            backgroundColor={color}
            size="$3"
            borderWidth={3}
            borderColor={currentColor === color ? 'black' : '$borderColor'}
          />
        ))}
      </View>

      <Button onPress={handleSubmit(onSubmit)} marginTop={10} disabled={isPending}>
        Create
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

export default DeckCreateModal;
