import { Button, Circle, Input, Label, Text, View } from 'tamagui';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard, StyleSheet } from 'react-native';
import useUpdateDeck from '../hooks/useUpdateDeck';
import { observer } from 'mobx-react';
import { useDeck } from '../hooks/useDeck';
import Toast from 'react-native-root-toast';
import { colors } from '../helpers/colors';
import { toastOptions } from '../helpers/toastOptions';
import Loader from '../components/Loader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './HomeView';

type Inputs = {
  deckName: string;
  color: string;
};

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckUpdateModal'> {}

function DeckUpdateModal({ route, navigation }: Props) {
  const { parentDeckId } = route.params;
  const { data: deck, isLoading } = useDeck(parentDeckId);
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
      parent_deck: parentDeckId || null,
      color: data.color,
    };

    mutateAsync({ ...newDeck, id: parentDeckId }).then(() => {
      Toast.show('Deck Updated', toastOptions);
      Keyboard.dismiss();
      navigation.goBack();
    });
  };

  useEffect(() => {
    if (deck) {
      setValue('deckName', deck.name);
      setValue('color', deck.color);
      setCurrentColor(deck.color);
    }
  }, [deck]);

  if (isLoading) {
    return <Loader />;
  }

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
      <View flexDirection="row" gap={10}>
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
        Edit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default observer(DeckUpdateModal);
