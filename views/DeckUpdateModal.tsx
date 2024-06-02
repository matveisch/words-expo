import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard, StyleSheet, View, Text } from 'react-native';
import Toast from 'react-native-root-toast';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import useUpdateDeck from '../hooks/useUpdateDeck';
import { colors, defaultColors } from '../helpers/colors';
import { toastOptions } from '../helpers/toastOptions';
import { RootStackParamList } from './HomeView';
import Label from '../ui/Label';
import Input from '../ui/Input';
import Circle from '../ui/Circle';
import Button from '../ui/Button';
import ThemedText from '../ui/ThemedText';

type Inputs = {
  deckName: string;
  color: string;
};

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckUpdateModal'> {}

function DeckUpdateModal({ route, navigation }: Props) {
  const { deck } = route.params;
  const [currentColor, setCurrentColor] = useState('');
  const { mutateAsync, isPending } = useUpdateDeck();

  const {
    control,
    handleSubmit,
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
      parent_deck: deck.id || null,
      color: data.color,
    };

    mutateAsync({ ...newDeck, id: deck.id }).then(() => {
      Toast.show('Deck Updated', toastOptions);
      Keyboard.dismiss();
      navigation.goBack();
    });
  };

  useEffect(() => {
    if (deck) {
      setValue('deckName', deck.name);
      setValue('color', deck.color || '');
      setCurrentColor(deck.color || '');
    }
  }, [deck]);

  return (
    <View style={styles.container}>
      <Label text="Name" />
      <Controller
        name="deckName"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input onChangeText={(text) => onChange(text)} onBlur={onBlur} value={value} />
        )}
      />
      {errors.deckName && <Text style={{ color: 'red' }}>This field is required</Text>}

      <Label text="Color" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {colors.map((color, index) => (
          <Circle
            onPress={() => {
              setValue('color', color);
              setCurrentColor(color);
            }}
            key={`${color}-${index}`}
            backgroundColor={color}
            borderColor={currentColor === color ? 'black' : undefined}
          />
        ))}
      </View>

      <Button
        onPress={handleSubmit(onSubmit)}
        isDisabled={isPending}
        style={{ marginTop: 10 }}
        backgroundColor={defaultColors.activeColor}
      >
        <ThemedText text="Edit" />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default DeckUpdateModal;
