import { makeAutoObservable } from 'mobx';

class WordModalStore {
  isWordModalOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsWordModalOpen(isOpen: boolean) {
    this.isWordModalOpen = isOpen;
  }
}

export const wordModalStore = new WordModalStore();
