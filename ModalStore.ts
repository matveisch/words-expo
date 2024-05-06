import { action, makeObservable, observable } from 'mobx';

class ModalStore {
  isModalOpen = false;

  constructor() {
    makeObservable(this, {
      isModalOpen: observable,
      openModal: action,
      closeModal: action,
      handleModal: action,
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
}

export const modalStore = new ModalStore();
