import { makeAutoObservable } from 'mobx';

class ModalStore {
  parentDeckId: number | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setParentDeckId(deckId: number | undefined) {
    this.parentDeckId = deckId;
  }
}

export const modalStore = new ModalStore();
