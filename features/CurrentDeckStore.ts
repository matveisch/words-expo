import { makeAutoObservable } from 'mobx';

class CurrentDeckStore {
  currentDeck: number | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentDeck(currentDeck: number) {
    this.currentDeck = currentDeck;
  }
}

export const currentDeckStore = new CurrentDeckStore();
