import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

class WordsLimitStore {
  limit = 20;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'WordsLimitStore',
      storage: AsyncStorage,
      properties: ['limit'],
    });
  }

  setLimit(limit: number) {
    this.limit = limit;
  }
}

export const wordsLimitStore = new WordsLimitStore();
