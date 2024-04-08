import { Button, Form, Input, Label, Sheet, Text } from 'tamagui';
import { useContext } from 'react';
import { DataContext, DataContextType } from '../helpers/DataContext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  deckName: string;
};

export default function SheetView() {
  const { openCreateDeckModal, setOpenCreateDeckModal } = useContext(
    DataContext
  ) as DataContextType;
  const {
    control,
    register,
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
      moveOnKeyboardChange
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding={10}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Label>Deck Name</Label>
          <Controller
            name="deckName"
            control={control}
            render={({ field }) => <Input size="$4" borderWidth={2} {...field} />}
          />
          {errors.deckName && <span>This field is required</span>}
          <Form.Trigger asChild marginTop={10}>
            <Button>Create</Button>
          </Form.Trigger>
        </Form>
      </Sheet.Frame>
    </Sheet>
  );
}
