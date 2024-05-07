import { action, makeObservable, observable } from 'mobx';

class ModalStore {
  isModalOpen = false;
  parentDeckId: number | undefined = undefined;
  currentDeckId: number | undefined = undefined;

  constructor() {
    makeObservable(this, {
      isModalOpen: observable,
      parentDeckId: observable,
      currentDeckId: observable,

      openModal: action,
      closeModal: action,
      handleModal: action,
      setParentDeckId: action,
      setCurrentDeckId: action,
    });
  }

  handleModal(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  setParentDeckId(deckId: number | undefined) {
    this.parentDeckId = deckId;
  }

  setCurrentDeckId(deckId: number | undefined) {
    this.currentDeckId = deckId;
  }
}

export const modalStore = new ModalStore();
