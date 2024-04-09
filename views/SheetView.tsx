import { Button, Form, Input, Label, Sheet, Text } from 'tamagui';
import { useContext } from 'react';
import { DataContext, DataContextType } from '../helpers/DataContext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View } from '@tamagui/core';

type Inputs = {
  deckName: string;
};

export default function SheetView() {
  const { openCreateDeckModal, setOpenCreateDeckModal } = useContext(
    DataContext
  ) as DataContextType;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      deckName: '',
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <Sheet
      modal
      forceRemoveScrollEnabled={openCreateDeckModal}
      open={openCreateDeckModal}
      onOpenChange={setOpenCreateDeckModal}
      dismissOnSnapToBottom
      zIndex={100_000}
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding={10}>
        <View>
          <Label>Deck Name</Label>
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
          <Button onPress={handleSubmit(onSubmit)} marginTop={10}>
            Create
          </Button>
        </View>
        {/*<Form onSubmit={handleSubmit(onSubmit)}>*/}
        {/*  <Label>Deck Name</Label>*/}
        {/*  <Controller*/}
        {/*    name="deckName"*/}
        {/*    control={control}*/}
        {/*    render={({ field }) => <Input {...field} size="$4" borderWidth={2} />}*/}
        {/*  />*/}
        {/*  {errors.deckName && <span>This field is required</span>}*/}
        {/*  <Form.Trigger asChild marginTop={10}>*/}
        {/*    <Button>Create</Button>*/}
        {/*  </Form.Trigger>*/}
        {/*</Form>*/}
      </Sheet.Frame>
    </Sheet>
  );
}
