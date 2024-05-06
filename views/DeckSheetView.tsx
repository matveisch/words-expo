import { Button, Circle, H3, Input, Label, Sheet, Text, View } from 'tamagui';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { blue, green, orange, pink, purple, red, yellow } from '@tamagui/colors';
import useAddSubDeck from '../hooks/useAddSubDeck';
import useUpdateDeck from '../hooks/useUpdateDeck';
import { observer } from 'mobx-react';
import { deckModalStore } from '../helpers/DeckModalStore';
import { useDeck } from '../hooks/useDeck';

type Inputs = {
  deckName: string;
  color: string;
};

type DeckSheetViewProps = {
  currentDeckId: number;
  edit: boolean;
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

function DeckSheetView(props: DeckSheetViewProps) {
  const { currentDeckId, edit } = props;
  const { data: deck } = useDeck(currentDeckId);
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

  const addSubDeck = useAddSubDeck();
  const updateDeck = useUpdateDeck();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const newDeck = {
      name: data.deckName,
      parent_deck: currentDeckId || null,
      color: data.color,
    };

    if (edit) {
      updateDeck.mutateAsync({ ...newDeck, id: currentDeckId }).then(() => {
        reset();
      });
    } else {
      addSubDeck.mutateAsync(newDeck).then(() => {
        reset();
      });
    }

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
          <H3 textAlign="center">{edit ? 'Edit Deck' : 'New Deck'}</H3>
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
            {edit ? 'Edit' : 'Create'}
          </Button>
        </View>
      </Sheet.Frame>
    </Sheet>
  );
}

export default observer(DeckSheetView);
