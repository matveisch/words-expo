import { Sheet, Text } from 'tamagui';
import { useContext } from 'react';
import { DataContext, DataContextType } from '../helpers/DataContext';

export default function SheetView() {
  const { openCreateDeckModal, setOpenCreateDeckModal } = useContext(
    DataContext
  ) as DataContextType;

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
      <Sheet.Frame>
        <Text>Hello Modal</Text>
      </Sheet.Frame>
    </Sheet>
  );
}
