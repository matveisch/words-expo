import { Button, Circle, H3, Input, Label, Sheet, Text, View } from 'tamagui';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { blue, green, orange, pink, purple, red, yellow } from '@tamagui/colors';
import useAddDeck from '../hooks/useAddDeck';
import useAddSubDeck from '../hooks/useAddSubDeck';

type Inputs = {
  deckName: string;
  color: string;
};

type SheetViewProps = {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  parentDeck?: number;
};

export default function SheetView(props: SheetViewProps) {
  const { openModal, setOpenModal, parentDeck } = props;
  const [currentColor, setCurrentColor] = useState('');
  const colors = [
    orange.orange7,
    yellow.yellow7,
    green.green7,
    blue.blue7,
    purple.purple7,
    pink.pink7,
    red.red7,
  ];
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
  const addDeck = useAddDeck();
  const addSubDeck = useAddSubDeck();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const newDeck = {
      name: data.deckName,
      parent_deck: parentDeck || null,
      color: data.color,
    };

    if (parentDeck) {
      addSubDeck.mutateAsync(newDeck).then(() => reset());
    } else {
      addDeck.mutateAsync(newDeck).then(() => reset());
    }

    Keyboard.dismiss();
    setOpenModal(false);
  };

  return (
    <Sheet
      modal
      forceRemoveScrollEnabled={openModal}
      open={openModal}
      onOpenChange={setOpenModal}
      dismissOnSnapToBottom
      zIndex={100_000}
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding={10}>
        <View>
          <H3 textAlign="center">New Deck</H3>
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
            Create
          </Button>
        </View>
      </Sheet.Frame>
    </Sheet>
  );
}
