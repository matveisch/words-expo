import { Button, Circle, H3, Input, Label, Sheet, Text, View } from 'tamagui';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { blue, green, orange, pink, purple, red, yellow } from '@tamagui/colors';
import useUpdateDeck from '../hooks/useUpdateDeck';
import { observer } from 'mobx-react';
import { deckModalStore } from '../helpers/DeckModalStore';
import { useDeck } from '../hooks/useDeck';
import Toast from 'react-native-root-toast';

type Inputs = {
  deckName: string;
  color: string;
};

const colors = [
  orange.orange7,
  yellow.yellow7,
  green.green7,
  blue.blue7,
  purple.purple7,
  pink.pink7,
  red.red7,
];

function DeckUpdateModal() {
  const { data: deck } = useDeck(deckModalStore.deckId!);
  const [currentColor, setCurrentColor] = useState(deck?.color);

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

  useEffect(() => {
    if (deck) {
      setValue('deckName', deck.name);
      setValue('color', deck.color);
      setCurrentColor(deck.color);
    }
  }, [deck]);
  const updateDeck = useUpdateDeck();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const newDeck = {
      name: data.deckName,
      parent_deck: deckModalStore.deckId || null,
      color: data.color,
    };

    updateDeck.mutateAsync({ ...newDeck, id: deckModalStore.deckId! }).then(() => {
      let toast = Toast.show('Deck Updated', {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: colors[0],
        opacity: 1,
        shadow: false,
        textColor: 'black',
      });
      reset();
    });

    Keyboard.dismiss();
    deckModalStore.setIsDeckModalOpen(false);
  };

  return (
    <Sheet
      modal
      forceRemoveScrollEnabled={deckModalStore.isDeckModalOpen}
      open={deckModalStore.isDeckModalOpen}
      onOpenChange={(state: boolean) => {
        deckModalStore.setIsDeckModalOpen(state);
      }}
      dismissOnSnapToBottom
      zIndex={100_000}
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding={10}>
        <View>
          <H3 textAlign="center">Edit Deck</H3>
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
          <Button onPress={handleSubmit(onSubmit)} marginTop={10}>
            Edit
          </Button>
        </View>
      </Sheet.Frame>
    </Sheet>
  );
}

export default observer(DeckUpdateModal);
