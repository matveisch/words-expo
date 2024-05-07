import { Button, Circle, H3, Input, Label, Sheet, Text, View } from 'tamagui';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import useAddDeck from '../hooks/useAddDeck';
import useAddSubDeck from '../hooks/useAddSubDeck';
import { observer } from 'mobx-react';
import { modalStore } from '../helpers/ModalStore';
import { colors } from '../helpers/colors';

type Inputs = {
  deckName: string;
  color: string;
};

const DeckCreateModal = observer(() => {
  const [currentColor, setCurrentColor] = useState('');

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
      parent_deck: modalStore.parentDeckId || null,
      color: data.color,
    };

    // add sub deck
    if (modalStore.parentDeckId) {
      addSubDeck.mutateAsync(newDeck).then(() => {
        reset();
        modalStore.setParentDeckId(undefined);
      });
      // add deck
    } else {
      addDeck.mutateAsync(newDeck).then(() => reset());
    }

    Keyboard.dismiss();
    modalStore.handleModal(false);
  };

  return (
    <Sheet
      modal
      forceRemoveScrollEnabled={modalStore.isModalOpen}
      open={modalStore.isModalOpen}
      onOpenChange={(state: boolean) => {
        modalStore.handleModal(state);
        reset();
        setCurrentColor('');
      }}
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
});

export default DeckCreateModal;