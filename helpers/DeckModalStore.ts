import { makeAutoObservable } from 'mobx';

class DeckModalStore {
  isDeckModalOpen = false;
  deckId: undefined | number = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setIsDeckModalOpen(isOpen: boolean) {
    this.isDeckModalOpen = isOpen;
  }

  setDeckId(deckId: number) {
    this.deckId = deckId;
  }
}

export const deckModalStore = new DeckModalStore();
