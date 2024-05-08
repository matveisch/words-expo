import { makeAutoObservable } from 'mobx';

class DeckModalStore {
  isDeckModalOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsDeckModalOpen(isOpen: boolean) {
    this.isDeckModalOpen = isOpen;
  }
}

export const deckModalStore = new DeckModalStore();
