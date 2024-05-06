import { makeAutoObservable } from 'mobx';

class DeckModalStore {
  edit = false;
  isDeckModalOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  setEdit(isEdit: boolean) {
    this.edit = isEdit;
  }

  setIsDeckModalOpen(isOpen: boolean) {
    this.isDeckModalOpen = isOpen;
  }
}

export const deckModalStore = new DeckModalStore();
