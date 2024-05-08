import { action, makeObservable, observable } from 'mobx';

class ModalStore {
  isModalOpen = false;
  parentDeckId: number | undefined = undefined;

  constructor() {
    makeObservable(this, {
      isModalOpen: observable,
      parentDeckId: observable,

      handleModal: action,
      setParentDeckId: action,
    });
  }

  handleModal(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  setParentDeckId(deckId: number | undefined) {
    this.parentDeckId = deckId;
  }
}

export const modalStore = new ModalStore();
